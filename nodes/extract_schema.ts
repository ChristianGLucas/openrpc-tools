import { ExtractSchemaInput, ExtractSchemaOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, componentSection, boundedStringify, OpenRPCError } from './lib';

/**
 * Extracts one named schema from components.schemas, re-serialized as
 * compact JSON text. `found` is false when the document has no
 * components.schemas, or no schema is registered under that name.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractSchema(ax: AxiomContext, input: ExtractSchemaInput): ExtractSchemaOutput {
  const out = new ExtractSchemaOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setFound(false);
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const schemas = componentSection(doc, 'schemas');
  const name = input.getSchemaName();
  if (!Object.prototype.hasOwnProperty.call(schemas, name)) {
    out.setFound(false);
    return out;
  }

  out.setFound(true);
  out.setSchemaJson(boundedStringify(schemas[name]));
  return out;
}
