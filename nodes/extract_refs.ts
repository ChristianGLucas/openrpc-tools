import { DocumentInput, ExtractRefsOutput, RefEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, collectRefs, isExternalRef, OpenRPCError } from './lib';

/**
 * Finds every "$ref" anywhere in the document — in method params/results/
 * errors, component schemas, anywhere — and reports its JSON-Pointer
 * location and literal target string. Every ref is only ever reported,
 * never fetched: is_internal is true for a same-document pointer
 * ("#/..."), is_remote is true for anything else (an http(s) URL, a bare
 * file path, a relative path). Use DereferenceDocument to actually inline
 * the internal ones.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractRefs(ax: AxiomContext, input: DocumentInput): ExtractRefsOutput {
  const out = new ExtractRefsOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const refs = collectRefs(doc);
  out.setRefsList(
    refs.map((r) => {
      const m = new RefEntry();
      m.setPath(r.path);
      m.setTarget(r.target);
      const external = isExternalRef(r.target);
      m.setIsInternal(!external);
      m.setIsRemote(external);
      return m;
    }),
  );
  return out;
}
