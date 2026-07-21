import { DocumentInput } from '../gen/messages_pb';
import { extractRefs } from './extract_refs';
import { ctx, FULL_DOC_JSON, EXTERNAL_REF_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractRefs', () => {
  it('finds every internal $ref in the document with its JSON-Pointer location', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = extractRefs(ctx, input);
    const refs = result
      .getRefsList()
      .map((r) => ({ path: r.getPath(), target: r.getTarget(), isInternal: r.getIsInternal(), isRemote: r.getIsRemote() }))
      .sort((a, b) => a.path.localeCompare(b.path));

    // Hand-enumerated from FULL_DOC by reading the fixture directly —
    // independent of the traversal code under test.
    const expected = [
      { path: '/components/schemas/User/properties/id', target: '#/components/schemas/UserId' },
      { path: '/methods/1/errors/1', target: '#/components/errors/AuthError' },
      { path: '/methods/1/params/0/schema', target: '#/components/schemas/UserId' },
      { path: '/methods/1/result/schema', target: '#/components/schemas/User' },
      { path: '/methods/1/tags/1', target: '#/components/tags/beta' },
      { path: '/methods/3/params/0', target: '#/components/contentDescriptors/Force' },
    ].sort((a, b) => a.path.localeCompare(b.path));

    expect(refs.length).toBe(6);
    for (let i = 0; i < expected.length; i++) {
      expect(refs[i].path).toBe(expected[i].path);
      expect(refs[i].target).toBe(expected[i].target);
      expect(refs[i].isInternal).toBe(true);
      expect(refs[i].isRemote).toBe(false);
    }
  });

  it('reports an external $ref as remote, never internal — and never fetches it', () => {
    const input = new DocumentInput();
    input.setDocument(EXTERNAL_REF_DOC_JSON);
    const result = extractRefs(ctx, input);
    const refs = result.getRefsList();
    expect(refs.length).toBe(1);
    expect(refs[0].getTarget()).toBe('https://example.com/schema.json#/Foo');
    expect(refs[0].getIsRemote()).toBe(true);
    expect(refs[0].getIsInternal()).toBe(false);
  });

  it('returns an empty list for a document with no refs at all', () => {
    const input = new DocumentInput();
    input.setDocument(JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [] }));
    const result = extractRefs(ctx, input);
    expect(result.getRefsList()).toEqual([]);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = extractRefs(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
