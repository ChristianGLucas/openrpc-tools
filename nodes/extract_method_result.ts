import { MethodNameInput, ExtractMethodResultOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, findMethod, toContentDescriptor, OpenRPCError } from './lib';
import { toContentDescriptorMsg } from './msg';

/**
 * Extracts one method's "result" content descriptor by method name: its
 * name, schema (or $ref target), and description. `found` is false when
 * no method with that name exists; `has_result` is false (with `found`
 * still true) for a notification-only method that declares no "result" at
 * all — a valid, spec-legal OpenRPC method shape.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMethodResult(ax: AxiomContext, input: MethodNameInput): ExtractMethodResultOutput {
  const out = new ExtractMethodResultOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setFound(false);
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const raw = findMethod(doc, input.getMethodName());
  if (!raw) {
    out.setFound(false);
    return out;
  }

  out.setFound(true);
  if (raw.result === undefined) {
    out.setHasResult(false);
    return out;
  }
  out.setHasResult(true);
  out.setResult(toContentDescriptorMsg(toContentDescriptor(raw.result)));
  return out;
}
