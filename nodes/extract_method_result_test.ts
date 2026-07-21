import { MethodNameInput } from '../gen/messages_pb';
import { extractMethodResult } from './extract_method_result';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractMethodResult', () => {
  it("extracts a method's inline result schema", () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('add');
    const result = extractMethodResult(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getHasResult()).toBe(true);
    expect(result.getResult()!.getName()).toBe('sum');
    expect(result.getResult()!.getSchemaJson()).toBe('{"type":"number"}');
  });

  it('has_result=false (found still true) for a notification method with no "result" field', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('ping');
    const result = extractMethodResult(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getHasResult()).toBe(false);
  });

  it('found=false for a method name that does not exist', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('nope');
    const result = extractMethodResult(ctx, input);
    expect(result.getFound()).toBe(false);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new MethodNameInput();
    input.setDocument(MALFORMED_JSON);
    input.setMethodName('add');
    const result = extractMethodResult(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toContain('JSON');
  });
});
