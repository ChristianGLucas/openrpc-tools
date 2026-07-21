import { MethodNameInput } from '../gen/messages_pb';
import { detectParamStructure } from './detect_param_structure';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('DetectParamStructure', () => {
  it('reports the spec default ("either") with explicit=false when paramStructure is absent', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('add');
    const result = detectParamStructure(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getParamStructure()).toBe('either');
    expect(result.getExplicit()).toBe(false);
  });

  it('reports the declared value with explicit=true when paramStructure is present', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('getUser');
    const result = detectParamStructure(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getParamStructure()).toBe('by-name');
    expect(result.getExplicit()).toBe(true);
  });

  it('found=false for a method name that does not exist', () => {
    const input = new MethodNameInput();
    input.setDocument(FULL_DOC_JSON);
    input.setMethodName('nope');
    const result = detectParamStructure(ctx, input);
    expect(result.getFound()).toBe(false);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new MethodNameInput();
    input.setDocument(MALFORMED_JSON);
    input.setMethodName('add');
    const result = detectParamStructure(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toContain('JSON');
  });
});
