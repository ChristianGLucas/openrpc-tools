// Shared helpers for every node in this package. Centralizes: bounded, safe
// JSON parsing of an OpenRPC document, JSON-Pointer-based $ref discovery and
// resolution, and the OpenRPC structural extraction (info/methods/params/
// result/errors/servers/components/tags) used by every listing/extraction
// node.
//
// SECURITY / DETERMINISM CONTRACT (see README for the full rationale):
//   - The document is ALWAYS supplied as JSON text by the caller (the
//     OpenRPC specification — unlike OpenAPI — is JSON-only; there is no
//     YAML variant to support). No node ever fetches a document over the
//     network or the filesystem.
//   - A "$ref" is NEVER resolved unless it is an internal, same-document
//     JSON Pointer ("#/..."). Any other form (an http(s) URL, a bare file
//     path, a relative path) is external and is always left untouched and
//     reported back — see isExternalRef / DereferenceDocument.
//   - Every entry point bounds raw input size, parsed-structure nesting
//     depth, and total node/serialization work before doing real work, so a
//     malformed or adversarial document returns a structured OpenRPCError
//     instead of hanging, crashing, or exhausting memory.
//   - No node uses the wall clock or any source of randomness — every node
//     is a pure, deterministic single-input -> single-output transform.

import Ajv, { ErrorObject as AjvErrorObject, ValidateFunction } from 'ajv';
import jsonSchemaToolsMetaRaw from '@json-schema-tools/meta-schema';
// @open-rpc/meta-schema's shipped .d.ts declares only the `OpenrpcDocument`
// TYPE, not the `openrpcDocument` VALUE its index.js actually exports at
// runtime (a genuine upstream typings gap — verified against the package's
// own compiled JS, not a mistake here) — imported via require() so
// TypeScript doesn't reject a runtime-real, type-undeclared export.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const openrpcMetaSchemaRaw: any = require('@open-rpc/meta-schema').openrpcDocument;

/** Raised for any problem with caller-supplied document text or structure.
 * Every node catches this (and any other error) and turns it into its
 * output message's `error` field — never allowed to propagate as an
 * unhandled exception. */
export class OpenRPCError extends Error {}

// Guards our own recursive/iterative tree-walking — and third-party
// recursive-descent code we hand the parsed structure to, e.g. Ajv's schema
// validator in ValidateDocument — against a pathologically deep document
// driving a native stack overflow (JSON.parse itself can throw a RangeError
// on extreme nesting — caught below — but we also bound the parsed
// structure explicitly as defense in depth). This is a stack-safety bound,
// not a payload-size one, so it stays even though the platform now owns
// input/output size limits.
export const MAX_INPUT_DEPTH = 300;
// dereferenceDocument's `build()` below is genuine JS-call-stack recursion;
// this is its stack-overflow guard.
export const MAX_SERIALIZE_DEPTH = 1000;

// DereferenceDocument's $ref-chain depth bound: a caller-supplied max_depth
// is clamped into [1, DEREF_MAX_DEPTH_CEILING]; 0/unset uses the default.
export const DEREF_DEFAULT_MAX_DEPTH = 50;
export const DEREF_MAX_DEPTH_CEILING = 200;

/** Iteratively (no recursion) checks that `root`'s nesting depth stays
 * within MAX_INPUT_DEPTH. Iterative on purpose: a naive recursive check
 * could itself stack-overflow on the very input it's meant to reject. */
function checkDepth(root: any): void {
  const stack: Array<{ node: any; depth: number }> = [{ node: root, depth: 0 }];
  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.depth > MAX_INPUT_DEPTH) {
      throw new OpenRPCError(`document nesting exceeds the maximum supported depth (${MAX_INPUT_DEPTH})`);
    }
    const node = top.node;
    if (node && typeof node === 'object') {
      const keys = Array.isArray(node) ? node.map((_: any, i: number) => i) : Object.keys(node);
      for (const key of keys) {
        stack.push({ node: (node as any)[key], depth: top.depth + 1 });
      }
    }
  }
}

/** Parse OpenRPC document text into a plain object, with every safety bound
 * in this file applied. Throws OpenRPCError on any problem — including a
 * JSON.parse RangeError from pathological nesting, which is caught here
 * rather than propagating as a native stack overflow. Never returns a
 * non-object top level. */
export function parseDocumentText(content: string): any {
  if (typeof content !== 'string' || content.length === 0) {
    throw new OpenRPCError('document is empty');
  }

  let doc: any;
  try {
    doc = JSON.parse(content);
  } catch (e: any) {
    // Covers both a normal SyntaxError (malformed JSON) and the RangeError
    // V8 throws for pathologically deep nesting — both are caller errors,
    // never a crash.
    throw new OpenRPCError(`could not parse document as JSON: ${e?.message || e}`);
  }

  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) {
    throw new OpenRPCError('parsed document is not a JSON object at the top level');
  }

  checkDepth(doc);
  return doc;
}

/** Serializes `value` to compact JSON. JSON.parse output can never contain a
 * real object cycle (only a subsequently-dereferenced structure can), so
 * this is a plain stringify. */
export function boundedStringify(value: any): string {
  return JSON.stringify(value === undefined ? null : value);
}

/** True for any $ref target that is NOT a same-document JSON pointer
 * ("#/..."). Internal refs always start with '#' per RFC 3986 fragment
 * syntax — anything else (http(s) URL, bare filename, relative path) is
 * external and MUST NEVER be fetched. */
export function isExternalRef(ref: string): boolean {
  return typeof ref === 'string' && !ref.startsWith('#');
}

export interface RawRefEntry {
  path: string;
  target: string;
}

/** Iteratively (no recursion, via an explicit queue — never the JS call
 * stack) collects every `$ref` string found anywhere in `root`, in a
 * stable breadth-first document order, with a JSON-Pointer path to each
 * occurrence. Parsed JSON can never contain a real cycle, so no
 * visited-set is needed for correctness. */
export function collectRefs(root: any): RawRefEntry[] {
  const out: RawRefEntry[] = [];
  const queue: Array<{ node: any; path: string }> = [{ node: root, path: '' }];
  let qi = 0;
  while (qi < queue.length) {
    const { node, path } = queue[qi++];
    if (!node || typeof node !== 'object') continue;
    if (!Array.isArray(node) && typeof (node as any).$ref === 'string') {
      out.push({ path: path || '#', target: (node as any).$ref });
    }
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        queue.push({ node: node[i], path: `${path}/${i}` });
      }
    } else {
      for (const key of Object.keys(node)) {
        queue.push({ node: (node as any)[key], path: `${path}/${jsonPointerEscape(key)}` });
      }
    }
  }
  return out;
}

export function jsonPointerEscape(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

function jsonPointerUnescape(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

/** Resolves an internal JSON Pointer ("#/a/b/0") against `doc`. Returns
 * {found:false} for anything else (a non-"#/"-prefixed ref, an out-of-range
 * array index, a missing key) rather than throwing — callers decide what
 * "not found" means for their node. */
export function resolvePointer(doc: any, ref: string): { found: boolean; value: any } {
  if (typeof ref !== 'string' || !ref.startsWith('#')) return { found: false, value: undefined };
  const pointer = ref.slice(1); // drop leading '#'
  if (pointer === '' || pointer === '/') return { found: true, value: doc };
  if (!pointer.startsWith('/')) return { found: false, value: undefined };
  const segments = pointer.slice(1).split('/').map(jsonPointerUnescape);
  let cur: any = doc;
  for (const seg of segments) {
    if (cur === null || typeof cur !== 'object') return { found: false, value: undefined };
    if (Array.isArray(cur)) {
      const idx = /^\d+$/.test(seg) ? Number(seg) : -1;
      if (idx < 0 || idx >= cur.length) return { found: false, value: undefined };
      cur = cur[idx];
    } else {
      if (!Object.prototype.hasOwnProperty.call(cur, seg)) return { found: false, value: undefined };
      cur = cur[seg];
    }
  }
  return { found: true, value: cur };
}

/** Finds a method by its declared "name" (methods MUST be uniquely named
 * per the OpenRPC spec). Returns undefined if doc.methods is missing/not an
 * array, or no method with that name exists. */
export function findMethod(doc: any, name: string): any | undefined {
  const methods = Array.isArray(doc?.methods) ? doc.methods : [];
  return methods.find((m: any) => m && typeof m === 'object' && m.name === name);
}

export interface ContentDescriptorOut {
  name: string;
  summary: string;
  description: string;
  required: boolean;
  deprecated: boolean;
  schemaJson: string;
  refTarget: string;
}

/** Normalizes one "params"/"result" entry — a Content Descriptor Object OR
 * a bare Reference Object ({"$ref": "..."}) per the OpenRPC spec — into a
 * flat shape. A schema-level $ref ({"schema": {"$ref": "..."}}) is reported
 * via refTarget too; schemaJson is empty in both ref cases. Never resolves
 * a $ref — that's ExtractRefs / DereferenceDocument's job. */
export function toContentDescriptor(raw: any): ContentDescriptorOut {
  if (raw && typeof raw === 'object' && typeof raw.$ref === 'string' && raw.name === undefined) {
    // The whole params/result entry is itself a Reference Object.
    return { name: '', summary: '', description: '', required: false, deprecated: false, schemaJson: '', refTarget: raw.$ref };
  }
  const r = raw && typeof raw === 'object' ? raw : {};
  let schemaJson = '';
  let refTarget = '';
  if (r.schema && typeof r.schema === 'object' && typeof r.schema.$ref === 'string') {
    refTarget = r.schema.$ref;
  } else if (r.schema !== undefined) {
    schemaJson = boundedStringify(r.schema);
  }
  return {
    name: typeof r.name === 'string' ? r.name : '',
    summary: typeof r.summary === 'string' ? r.summary : '',
    description: typeof r.description === 'string' ? r.description : '',
    required: !!r.required,
    deprecated: !!r.deprecated,
    schemaJson,
    refTarget,
  };
}

export interface ErrorOut {
  code: number;
  message: string;
  dataSchemaJson: string;
  refTarget: string;
  componentName: string;
}

/** Normalizes one error entry — an Error Object OR a bare Reference Object —
 * into a flat shape. `componentName` is set by the caller when listing
 * components.errors (the map key); empty for a method's own errors array. */
export function toErrorObject(raw: any, componentName = ''): ErrorOut {
  if (raw && typeof raw === 'object' && typeof raw.$ref === 'string' && raw.code === undefined) {
    return { code: 0, message: '', dataSchemaJson: '', refTarget: raw.$ref, componentName };
  }
  const r = raw && typeof raw === 'object' ? raw : {};
  return {
    code: typeof r.code === 'number' ? r.code : 0,
    message: typeof r.message === 'string' ? r.message : '',
    dataSchemaJson: r.data !== undefined ? boundedStringify(r.data) : '',
    refTarget: '',
    componentName,
  };
}

/** Extracts one method's tag names. Per the OpenRPC spec, `method.tags` is
 * an array of Tag Objects (each with a "name") OR Reference Objects, never
 * bare strings. An inline tag contributes its declared name directly. A
 * $ref is resolved ONE hop, internally only (the same bounded,
 * network-free `resolvePointer` used everywhere else) so that a tag
 * referenced from a method and the same tag registered in
 * components.tags report the identical name — the idiomatic OpenRPC
 * pattern (see the spec's own examples) of declaring every tag once under
 * components.tags and referencing it from methods would otherwise produce
 * two different "names" (a raw pointer string here, the real name there)
 * for what is obviously the same tag, corrupting GroupMethodsByTag /
 * CountSummary. An external or dangling ref falls back to the literal
 * $ref string, still never fetched. */
export function methodTagNames(doc: any, rawMethod: any): string[] {
  const tags = Array.isArray(rawMethod?.tags) ? rawMethod.tags : [];
  const out: string[] = [];
  for (const t of tags) {
    if (!t || typeof t !== 'object') continue;
    if (typeof t.$ref === 'string' && t.name === undefined) {
      if (!isExternalRef(t.$ref)) {
        const resolved = resolvePointer(doc, t.$ref);
        if (resolved.found && resolved.value && typeof resolved.value === 'object' && typeof resolved.value.name === 'string') {
          out.push(resolved.value.name);
          continue;
        }
      }
      out.push(t.$ref);
    } else if (typeof t.name === 'string') {
      out.push(t.name);
    }
  }
  return out;
}

export interface ParamStructureOut {
  value: string;
  explicit: boolean;
}

/** Detects a method's declared (or spec-defaulted) paramStructure. Reports
 * whatever value is literally declared (even one outside the spec's
 * documented enum) — this node is inspection, not validation; use
 * ValidateDocument to catch a malformed value. */
export function resolveParamStructure(rawMethod: any): ParamStructureOut {
  const v = rawMethod?.paramStructure;
  if (typeof v === 'string' && v.length > 0) {
    return { value: v, explicit: true };
  }
  return { value: 'either', explicit: false };
}

/** Returns the array at doc.methods, or [] if absent/not an array. */
export function methodsOf(doc: any): any[] {
  return Array.isArray(doc?.methods) ? doc.methods : [];
}

/** Returns the object at doc.components.<section>, or {} if absent. */
export function componentSection(doc: any, section: string): Record<string, any> {
  const c = doc?.components;
  if (!c || typeof c !== 'object') return {};
  const s = c[section];
  return s && typeof s === 'object' && !Array.isArray(s) ? s : {};
}

/** 0/unset (or non-finite/negative) input means "use the default"; anything
 * else is clamped into [1, DEREF_MAX_DEPTH_CEILING]. */
function resolveMaxDepth(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return DEREF_DEFAULT_MAX_DEPTH;
  return Math.max(1, Math.min(DEREF_MAX_DEPTH_CEILING, Math.floor(n)));
}

export interface DereferenceResult {
  docOut: any;
  unresolvedRemote: string[];
  circular: string[];
}

/** Inlines every internal ("#/...") $ref in `doc`, recursively resolving
 * refs found inside resolved targets too. A remote ref (anything not
 * "#/...") is NEVER fetched — always left in place and reported in
 * `unresolvedRemote`. A true cycle (a ref reachable from itself along the
 * current resolution chain) is detected via an explicit per-branch
 * "currently resolving" set and left in place, reported in `circular` —
 * never followed forever. A chain longer than `maxDepthInput` (clamped
 * into [1, DEREF_MAX_DEPTH_CEILING]; 0/unset uses the default) is treated
 * the same way: left in place, reported in `circular`, since from the
 * caller's point of view both are "this $ref was deliberately not resolved
 * further for safety." A dangling internal ref (points nowhere) is simply
 * left in place, visible as a literal {"$ref": ...} in the output —
 * neither remote nor circular, so not separately bucketed.
 *
 * Recursion is real (JS call-stack) but bounded by an explicit depth
 * counter checked on every call, so a pathological document fails with an
 * OpenRPCError well before it could exhaust the native stack — never a
 * silent crash. */
export function dereferenceDocument(doc: any, maxDepthInput: number): DereferenceResult {
  const maxDepth = resolveMaxDepth(maxDepthInput);
  const unresolvedRemote = new Set<string>();
  const circular = new Set<string>();

  function build(node: any, chain: Set<string>, structDepth: number): any {
    if (structDepth > MAX_SERIALIZE_DEPTH) {
      throw new OpenRPCError(`dereferenced document nesting exceeds the maximum supported depth (${MAX_SERIALIZE_DEPTH})`);
    }
    if (node === null || typeof node !== 'object') return node;
    if (!Array.isArray(node) && typeof node.$ref === 'string') {
      const ref = node.$ref;
      if (isExternalRef(ref)) {
        unresolvedRemote.add(ref);
        return node;
      }
      if (chain.has(ref) || chain.size >= maxDepth) {
        circular.add(ref);
        return node;
      }
      const resolved = resolvePointer(doc, ref);
      if (!resolved.found) {
        return node; // dangling internal ref: left in place, visible as-is
      }
      const nextChain = new Set(chain);
      nextChain.add(ref);
      return build(resolved.value, nextChain, structDepth + 1);
    }
    if (Array.isArray(node)) {
      return node.map((v: any) => build(v, chain, structDepth + 1));
    }
    const out: any = {};
    for (const k of Object.keys(node)) {
      out[k] = build(node[k], chain, structDepth + 1);
    }
    return out;
  }

  const docOut = build(doc, new Set<string>(), 0);
  return { docOut, unresolvedRemote: Array.from(unresolvedRemote), circular: Array.from(circular) };
}

// ---------------------------------------------------------------------------
// Meta-schema validation (ValidateDocument)
//
// The official OpenRPC meta-schema (@open-rpc/meta-schema, Apache-2.0) is a
// JSON Schema draft-07-shaped document. It intentionally delegates "what is
// a valid JSON Schema value" (used for every method's params/result/error
// schema) to its sibling package's own meta-schema, referencing it by a
// live URL ("https://meta.json-schema.tools/", with and without a trailing
// slash — both literal forms appear). We never fetch that URL: instead we
// vendor the equivalent content from @json-schema-tools/meta-schema
// (Apache-2.0, from the same open-rpc/json-schema-tools org) as an
// npm dependency and register it with Ajv under both literal URI forms, so
// the whole compile resolves completely offline. This composition is the
// meta-schema's own documented design — not a workaround — but it is
// undocumented that both slash-variants must be registered for Ajv to
// resolve every $ref in practice (see the package's README/friction notes).
// ---------------------------------------------------------------------------

let compiledValidator: ValidateFunction | null = null;

function getValidator(): ValidateFunction {
  if (compiledValidator) return compiledValidator;

  const orpcSchema = JSON.parse(JSON.stringify(openrpcMetaSchemaRaw));
  delete orpcSchema.$schema; // avoid Ajv resolving its own self-referential $schema as a meta-validator
  const jstMeta = JSON.parse(JSON.stringify(jsonSchemaToolsMetaRaw));
  delete jstMeta.$schema;

  const ajv = new Ajv({ strict: false, allErrors: true, validateSchema: false });
  ajv.addSchema({ ...jstMeta, $id: 'https://meta.json-schema.tools/' });
  ajv.addSchema({ ...jstMeta, $id: 'https://meta.json-schema.tools' });
  compiledValidator = ajv.compile(orpcSchema);
  return compiledValidator;
}

export interface MetaSchemaViolation {
  message: string;
  instancePath: string;
  keywordPath: string;
}

/** Validates a parsed document against the official OpenRPC meta-schema.
 * Never performs network I/O — the meta-schema and its dependency are both
 * vendored as npm packages and the compiled validator resolves entirely
 * offline. `doc` must already be the output of parseDocumentText (a bounded,
 * parsed JSON object) — this function does not re-check size/depth. */
export function validateAgainstMetaSchema(doc: any): { valid: boolean; violations: MetaSchemaViolation[] } {
  const validate = getValidator();
  const valid = !!validate(doc);
  if (valid) return { valid: true, violations: [] };
  const errors: AjvErrorObject[] = validate.errors || [];
  const violations = errors.map((e) => ({
    message: e.message || 'validation error',
    instancePath: e.instancePath || '',
    keywordPath: e.schemaPath || '',
  }));
  return { valid: false, violations };
}
