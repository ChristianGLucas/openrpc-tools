import { MethodNameInput } from '../gen/messages_pb';
import { extractMethodParams } from './extract_method_params';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractMethodParams', () => {
  it("extracts a method's params with their required flags", () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('add');
    const result = extractMethodParams(ctx, input);
    expect(result.getFound()).toBe(true);
    const params = result.getParamsList();
    expect(params.map((p) => p.getName())).toEqual(['a', 'b']);
    expect(params.every((p) => p.getRequired())).toBe(true);
    expect(params[0].getSchemaJson()).toBe('{"type":"number"}');
  });

  it('returns an empty params list for a method with no params, found still true', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('ping');
    const result = extractMethodParams(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getParamsList()).toEqual([]);
  });

  it('found=false for a method name that does not exist', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('nope');
    const result = extractMethodParams(ctx, input);
    expect(result.getFound()).toBe(false);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new MethodNameInput();
    input.setDocument(MALFORMED_JSON);
    input.setMethodName('add');
    const result = extractMethodParams(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toContain('JSON');
  });
});
