import { MethodNameInput, ExtractMethodParamsOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, findMethod, toContentDescriptor, OpenRPCError } from './lib';
import { toContentDescriptorMsg } from './msg';

/**
 * Extracts one method's parameter list by method name: each param's name,
 * schema (or $ref target if the param or its schema is itself a
 * reference), required/deprecated flags, and summary/description. `found`
 * is false when no method with that name exists.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMethodParams(ax: AxiomContext, input: MethodNameInput): ExtractMethodParamsOutput {
  const out = new ExtractMethodParamsOutput();
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

  const params = Array.isArray(raw.params) ? raw.params : [];
  out.setParamsList(params.map((p: any) => toContentDescriptorMsg(toContentDescriptor(p))));
  out.setFound(true);
  return out;
}
