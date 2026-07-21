import { ExtractErrorsInput } from '../gen/messages_pb';
import { extractErrors } from './extract_errors';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractErrors', () => {
  it('extracts the registered components.errors as global_errors', () => {
    const input = new ExtractErrorsInput();
    input.setDocument(FULL_DOC_JSON);
    const result = extractErrors(ctx, input);
    const globals = result.getGlobalErrorsList();
    expect(globals.length).toBe(1);
    expect(globals[0].getComponentName()).toBe('AuthError');
    expect(globals[0].getCode()).toBe(-32001);
    expect(globals[0].getMessage()).toBe('Unauthorized');
  });

  it('extracts every method that declares at least one error, when no filter is set', () => {
    const input = new ExtractErrorsInput();
    input.setDocument(FULL_DOC_JSON);
    const result = extractErrors(ctx, input);
    const methodErrors = result.getMethodErrorsList();
    expect(methodErrors.length).toBe(1);
    expect(methodErrors[0].getMethodName()).toBe('getUser');
    expect(methodErrors[0].getErrorsList().length).toBe(2);
  });

  it('filters to one method by name', () => {
    const input = new ExtractErrorsInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('add');
    const result = extractErrors(ctx, input);
    expect(result.getMethodErrorsList()).toEqual([]); // "add" declares no errors
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new ExtractErrorsInput();
    input.setDocument(MALFORMED_JSON);
    const result = extractErrors(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
