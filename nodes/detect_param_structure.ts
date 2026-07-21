import { MethodNameInput, DetectParamStructureOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, findMethod, resolveParamStructure, OpenRPCError } from './lib';

/**
 * Detects one method's declared (or spec-defaulted) param-passing style —
 * "by-name", "by-position", or "either" — by method name. `explicit` is
 * true when the method's own "paramStructure" field was present in the
 * document; false when it was absent and the OpenRPC spec's default
 * ("either") is being reported instead. `found` is false when no method
 * with that name exists.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectParamStructure(ax: AxiomContext, input: MethodNameInput): DetectParamStructureOutput {
  const out = new DetectParamStructureOutput();
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

  const { value, explicit } = resolveParamStructure(raw);
  out.setFound(true);
  out.setParamStructure(value);
  out.setExplicit(explicit);
  return out;
}
