import { DocumentInput } from '../gen/messages_pb';
import { listMethods } from './list_methods';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ListMethods', () => {
  it('lists every method in document order with the right summary shape', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = listMethods(ctx, input);
    const methods = result.getMethodsList();
    expect(methods.map((m) => m.getName())).toEqual(['add', 'getUser', 'ping', 'deleteAll']);

    const add = methods[0];
    expect(add.getParamNamesList()).toEqual(['a', 'b']);
    expect(add.getResultName()).toBe('sum');
    expect(add.getDeprecated()).toBe(false);
    expect(add.getTagsList()).toEqual([]);

    const getUser = methods[1];
    expect(getUser.getParamNamesList()).toEqual(['id']);
    expect(getUser.getResultName()).toBe('user');
    expect(getUser.getDeprecated()).toBe(true);
    // The $ref tag resolves to its registered name ('beta'), not the raw pointer.
    expect(getUser.getTagsList()).toEqual(['users', 'beta']);

    const ping = methods[2];
    expect(ping.getParamNamesList()).toEqual([]);
    expect(ping.getResultName()).toBe(''); // notification method: no "result" at all

    const deleteAll = methods[3];
    // The whole param entry is a bare $ref, so it has no literal "name".
    expect(deleteAll.getParamNamesList()).toEqual(['']);
  });

  it('returns an empty list for a document with no methods array populated, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' } }));
    const result = listMethods(ctx, input);
    expect(result.getMethodsList()).toEqual([]);
    expect(result.getError()).toBe('');
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = listMethods(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
