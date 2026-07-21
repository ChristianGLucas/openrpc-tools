import { DereferenceInput, DereferenceOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, dereferenceDocument as dereferenceDoc, boundedStringify, OpenRPCError } from './lib';

/**
 * Inlines every internal ("#/...") $ref in the document, recursively —
 * resolving a ref that points at an object which itself contains further
 * refs. A remote ref (an http(s) URL, a file path, anything not
 * "#/...") is NEVER fetched: it's always left untouched in the output and
 * reported in unresolved_remote_refs. A $ref cycle is detected (not
 * infinitely followed) and reported in circular_refs, with the cyclic
 * $ref left in place rather than inlined; a chain longer than max_depth
 * (clamped into [1, 200]; 0/unset uses a default of 50) is treated the
 * same way. A dangling internal ref (points nowhere in the document) is
 * simply left in place, visible as a literal $ref object in the output.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function dereferenceDocument(ax: AxiomContext, input: DereferenceInput): DereferenceOutput {
  const out = new DereferenceOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  try {
    const { docOut, unresolvedRemote, circular } = dereferenceDoc(doc, input.getMaxDepth());
    out.setDocumentJson(boundedStringify(docOut));
    out.setUnresolvedRemoteRefsList(unresolvedRemote);
    out.setCircularRefsList(circular);
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
  }
  return out;
}
