import { DocumentInput, ValidateDocumentOutput, ValidationViolation } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, validateAgainstMetaSchema, OpenRPCError } from './lib';

/**
 * Validates a document against the official OpenRPC meta-schema
 * (https://github.com/open-rpc/meta-schema) using Ajv, a JSON Schema
 * validator — full structural conformance, not just the top-level shape
 * ParseDocument checks. Every violation is reported with its instance and
 * schema-keyword JSON Pointers. The meta-schema and its dependency are
 * both vendored as npm packages and compiled once; validation is entirely
 * offline and deterministic — no node ever fetches anything over the
 * network. `parse_error` is set instead of `violations` when the input
 * could not even be parsed as JSON or exceeded the size limit.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateDocument(ax: AxiomContext, input: DocumentInput): ValidateDocumentOutput {
  const out = new ValidateDocumentOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setValid(false);
    out.setParseError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const { valid, violations } = validateAgainstMetaSchema(doc);
  out.setValid(valid);
  out.setViolationsList(
    violations.map((v) => {
      const m = new ValidationViolation();
      m.setMessage(v.message);
      m.setInstancePath(v.instancePath);
      m.setKeywordPath(v.keywordPath);
      return m;
    }),
  );
  return out;
}
