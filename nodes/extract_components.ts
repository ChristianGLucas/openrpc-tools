import { DocumentInput, ExtractComponentsOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, componentSection, OpenRPCError } from './lib';

/**
 * Lists the key names in every "components" category: schemas and
 * contentDescriptors (the two most commonly reused), plus errors,
 * examples, examplePairings, links, and tags. Use ExtractSchema to get one
 * named schema's full body. An absent "components" object (spec-legal —
 * it's optional) reports every list as empty, not an error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractComponents(ax: AxiomContext, input: DocumentInput): ExtractComponentsOutput {
  const out = new ExtractComponentsOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  out.setSchemaNamesList(Object.keys(componentSection(doc, 'schemas')));
  out.setContentDescriptorNamesList(Object.keys(componentSection(doc, 'contentDescriptors')));
  out.setErrorNamesList(Object.keys(componentSection(doc, 'errors')));
  out.setExampleNamesList(Object.keys(componentSection(doc, 'examples')));
  out.setExamplePairingNamesList(Object.keys(componentSection(doc, 'examplePairings')));
  out.setLinkNamesList(Object.keys(componentSection(doc, 'links')));
  out.setTagNamesList(Object.keys(componentSection(doc, 'tags')));
  return out;
}
