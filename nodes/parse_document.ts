import { DocumentInput, ParseDocumentOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, OpenRPCError, componentSection, methodsOf } from './lib';
import { toDocErrorMsg } from './msg';

/**
 * Lightweight structural parse of an OpenRPC document: confirms the JSON
 * text parses and has the minimum OpenRPC shape (an "openrpc" version
 * string, an "info" object, and a "methods" array — the three top-level
 * fields the spec requires), and reports top-level counts (methods,
 * components.schemas, servers). Does not check every method or schema
 * against the full OpenRPC meta-schema — use ValidateDocument for that.
 * Malformed or oversized input returns valid=false with a structured error
 * instead of throwing.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseDocument(ax: AxiomContext, input: DocumentInput): ParseDocumentOutput {
  const out = new ParseDocumentOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setValid(false);
    out.setError(toDocErrorMsg(e instanceof OpenRPCError ? e.message : String(e?.message || e)));
    return out;
  }

  const missing: string[] = [];
  if (typeof doc.openrpc !== 'string' || doc.openrpc.length === 0) missing.push('openrpc');
  if (!doc.info || typeof doc.info !== 'object') missing.push('info');
  if (!Array.isArray(doc.methods)) missing.push('methods');

  if (missing.length > 0) {
    out.setValid(false);
    out.setError(toDocErrorMsg(`document is missing required top-level field(s): ${missing.join(', ')}`));
    return out;
  }

  out.setValid(true);
  out.setOpenrpcVersion(String(doc.openrpc));
  out.setMethodCount(methodsOf(doc).length);
  out.setSchemaCount(Object.keys(componentSection(doc, 'schemas')).length);
  out.setServerCount(Array.isArray(doc.servers) ? doc.servers.length : 0);
  return out;
}
