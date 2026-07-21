import { DocumentInput, CountSummaryOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, methodsOf, componentSection, methodTagNames, OpenRPCError } from './lib';

/**
 * Document-wide capability counts, for a quick "what's in this API"
 * overview without walking the full structure: method_count and
 * server_count are the top-level methods/servers array lengths.
 * tag_count is the number of distinct tag names in use — the union of
 * every method's inline tags and components.tags' registered names (the
 * OpenRPC spec has no single top-level tags array to count directly).
 * schema_count / content_descriptor_count / error_definition_count /
 * example_count are each the size of the corresponding components.*
 * registry (their only canonical location in an OpenRPC document).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function countSummary(ax: AxiomContext, input: DocumentInput): CountSummaryOutput {
  const out = new CountSummaryOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const methods = methodsOf(doc);
  const tagNames = new Set<string>();
  for (const m of methods) {
    for (const t of methodTagNames(doc, m)) tagNames.add(t);
  }
  for (const t of Object.keys(componentSection(doc, 'tags'))) tagNames.add(t);

  out.setMethodCount(methods.length);
  out.setSchemaCount(Object.keys(componentSection(doc, 'schemas')).length);
  out.setServerCount(Array.isArray(doc.servers) ? doc.servers.length : 0);
  out.setTagCount(tagNames.size);
  out.setContentDescriptorCount(Object.keys(componentSection(doc, 'contentDescriptors')).length);
  out.setErrorDefinitionCount(Object.keys(componentSection(doc, 'errors')).length);
  out.setExampleCount(Object.keys(componentSection(doc, 'examples')).length);
  return out;
}
