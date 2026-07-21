import { ExtractErrorsInput, ExtractErrorsOutput, MethodErrors } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, methodsOf, componentSection, toErrorObject, OpenRPCError } from './lib';
import { toErrorObjectMsg } from './msg';

/**
 * Extracts declared JSON-RPC errors: the document's reusable
 * "components.errors" (global_errors, always returned in full) plus each
 * method's own inline/referenced "errors" array (method_errors). Set
 * `method_name` to restrict method_errors to one method (found=false if it
 * doesn't exist or declares no errors); leave it empty to get every method
 * that declares at least one error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractErrors(ax: AxiomContext, input: ExtractErrorsInput): ExtractErrorsOutput {
  const out = new ExtractErrorsOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const globalErrorsSection = componentSection(doc, 'errors');
  out.setGlobalErrorsList(
    Object.keys(globalErrorsSection).map((name) => toErrorObjectMsg(toErrorObject(globalErrorsSection[name], name))),
  );

  const wantMethod = input.getMethodName();
  const methodErrorsOut: MethodErrors[] = [];
  for (const raw of methodsOf(doc)) {
    if (!raw || typeof raw !== 'object') continue;
    const name = typeof raw.name === 'string' ? raw.name : '';
    if (wantMethod && name !== wantMethod) continue;
    const errors = Array.isArray(raw.errors) ? raw.errors : [];
    if (errors.length === 0) continue;
    const me = new MethodErrors();
    me.setMethodName(name);
    me.setErrorsList(errors.map((e: any) => toErrorObjectMsg(toErrorObject(e))));
    methodErrorsOut.push(me);
  }
  out.setMethodErrorsList(methodErrorsOut);
  return out;
}
