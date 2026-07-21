import { MethodNameInput } from '../gen/messages_pb';
import { extractMethod } from './extract_method';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractMethod', () => {
  it('extracts full detail for a method with $ref params/result/errors/tags, an explicit paramStructure, and an example', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('getUser');
    const result = extractMethod(ctx, input);
    expect(result.getFound()).toBe(true);
    const m = result.getMethod()!;
    expect(m.getName()).toBe('getUser');
    expect(m.getDeprecated()).toBe(true);
    expect(m.getParamStructure()).toBe('by-name');

    const params = m.getParamsList();
    expect(params.length).toBe(1);
    expect(params[0].getName()).toBe('id');
    expect(params[0].getRefTarget()).toBe('#/components/schemas/UserId');
    expect(params[0].getSchemaJson()).toBe(''); // schema itself is a bare $ref

    expect(m.getResult()!.getRefTarget()).toBe('#/components/schemas/User');

    const errors = m.getErrorsList();
    expect(errors.length).toBe(2);
    expect(errors[0].getCode()).toBe(404);
    expect(errors[0].getMessage()).toBe('Not found');
    expect(errors[0].getDataSchemaJson()).toBe('{"type":"string"}');
    expect(errors[1].getRefTarget()).toBe('#/components/errors/AuthError');

    expect(m.getTagsList()).toEqual(['users', 'beta']);

    const examples = m.getExamplesList();
    expect(examples.length).toBe(1);
    expect(examples[0].getName()).toBe('ex1');
    expect(examples[0].getParamsJson()).toBe(JSON.stringify([{ name: 'id', value: 'u1' }]));
    expect(examples[0].getResultJson()).toBe(JSON.stringify({ name: 'user', value: { id: 'u1', name: 'Alice' } }));
  });

  it('extracts a method whose entire param entry is a bare Reference Object', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('deleteAll');
    const result = extractMethod(ctx, input);
    const params = result.getMethod()!.getParamsList();
    expect(params.length).toBe(1);
    expect(params[0].getName()).toBe('');
    expect(params[0].getRefTarget()).toBe('#/components/contentDescriptors/Force');
  });

  it('extracts a notification method with no result, and reports the spec default paramStructure', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('ping');
    const result = extractMethod(ctx, input);
    expect(result.getFound()).toBe(true);
    const m = result.getMethod()!;
    expect(m.getResult()).toBeUndefined();
    expect(m.getParamStructure()).toBe('either');
    expect(m.getErrorsList()).toEqual([]);
  });

  it('found=false for a method name that does not exist', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('doesNotExist');
    const result = extractMethod(ctx, input);
    expect(result.getFound()).toBe(false);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new MethodNameInput();
    input.setDocument(MALFORMED_JSON);
    input.setMethodName('anything');
    const result = extractMethod(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toContain('JSON');
  });
});
