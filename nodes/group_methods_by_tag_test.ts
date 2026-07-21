import { DocumentInput } from '../gen/messages_pb';
import { groupMethodsByTag } from './group_methods_by_tag';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('GroupMethodsByTag', () => {
  it('groups getUser under both its inline tag and its $ref tag (resolved to the same registered name), and lists every other method as untagged', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = groupMethodsByTag(ctx, input);
    const groups = result.getGroupsList();
    expect(groups.map((g) => g.getTagName())).toEqual(['users', 'beta']);
    expect(groups[0].getMethodNamesList()).toEqual(['getUser']);
    expect(groups[1].getMethodNamesList()).toEqual(['getUser']);
    expect(result.getUntaggedMethodsList()).toEqual(['add', 'ping', 'deleteAll']);
  });

  it('returns an empty groups list (all methods untagged) for a document with no tags anywhere', () => {
    const input = new DocumentInput();
    input.setDocument(
      JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [{ name: 'a', params: [] }] }),
    );
    const result = groupMethodsByTag(ctx, input);
    expect(result.getGroupsList()).toEqual([]);
    expect(result.getUntaggedMethodsList()).toEqual(['a']);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = groupMethodsByTag(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
