import { DocumentInput, ListMethodsOutput, MethodSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, methodsOf, methodTagNames, OpenRPCError } from './lib';

/**
 * Lists every method declared in the document's "methods" array, in
 * document order: name, summary, description, deprecated flag, param
 * names, the result content descriptor's name, and tag names. A
 * lightweight overview — use ExtractMethod for one method's full detail
 * (param schemas, result schema, errors, examples).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listMethods(ax: AxiomContext, input: DocumentInput): ListMethodsOutput {
  const out = new ListMethodsOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const summaries = methodsOf(doc).map((raw: any) => {
    const m = new MethodSummary();
    if (!raw || typeof raw !== 'object') return m;
    m.setName(typeof raw.name === 'string' ? raw.name : '');
    m.setSummary(typeof raw.summary === 'string' ? raw.summary : '');
    m.setDescription(typeof raw.description === 'string' ? raw.description : '');
    m.setDeprecated(!!raw.deprecated);
    const params = Array.isArray(raw.params) ? raw.params : [];
    m.setParamNamesList(
      params.map((p: any) => (p && typeof p === 'object' && typeof p.name === 'string' ? p.name : '')),
    );
    const result = raw.result;
    m.setResultName(result && typeof result === 'object' && typeof result.name === 'string' ? result.name : '');
    m.setTagsList(methodTagNames(doc, raw));
    return m;
  });
  out.setMethodsList(summaries);
  return out;
}
