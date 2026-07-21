import { DocumentInput, GroupMethodsByTagOutput, TagGroup } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, methodsOf, methodTagNames, OpenRPCError } from './lib';

/**
 * Groups every method by the tags it declares (method.tags — OpenRPC has
 * no top-level "tags" array the way OpenAPI does; tags only exist inline
 * per-method and, reusably, under components.tags). Groups are returned in
 * first-seen tag order, each listing its methods' names in document order.
 * Methods that declare no tags at all are listed separately in
 * untagged_methods rather than silently dropped.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function groupMethodsByTag(ax: AxiomContext, input: DocumentInput): GroupMethodsByTagOutput {
  const out = new GroupMethodsByTagOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const order: string[] = [];
  const groups = new Map<string, string[]>();
  const untagged: string[] = [];

  for (const raw of methodsOf(doc)) {
    if (!raw || typeof raw !== 'object') continue;
    const name = typeof raw.name === 'string' ? raw.name : '';
    const tags = methodTagNames(doc, raw);
    if (tags.length === 0) {
      untagged.push(name);
      continue;
    }
    for (const tag of tags) {
      if (!groups.has(tag)) {
        groups.set(tag, []);
        order.push(tag);
      }
      groups.get(tag)!.push(name);
    }
  }

  out.setGroupsList(
    order.map((tag) => {
      const g = new TagGroup();
      g.setTagName(tag);
      g.setMethodNamesList(groups.get(tag) || []);
      return g;
    }),
  );
  out.setUntaggedMethodsList(untagged);
  return out;
}
