import { DocumentInput } from '../gen/messages_pb';
import { validateDocument } from './validate_document';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON, SPEC_INVALID_DOC_JSON } from './testkit';

describe('ValidateDocument', () => {
  it('accepts a spec-conformant document', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getViolationsList().length).toBe(0);
  });

  it("independent oracle: flags a method missing the meta-schema's required 'params' field", () => {
    // The official OpenRPC meta-schema's methodObject.required is exactly
    // ["name", "params"] (verified by reading @open-rpc/meta-schema's own
    // definitions.methodObject.required directly, independent of this
    // package's extraction code) — a method object with no "params" at all
    // MUST be rejected, and the violation must name the missing property.
    const input = new DocumentInput();
    input.setDocument(SPEC_INVALID_DOC_JSON);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    const violations = result.getViolationsList();
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some((v) => v.getMessage().includes('params'))).toBe(true);
  });

  it('sets parse_error (not violations) for malformed JSON, never crashes', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getParseError()).toContain('JSON');
    expect(result.getViolationsList().length).toBe(0);
  });

  it('is deterministic across repeated invocations on the same input', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const first = validateDocument(ctx, input);
    const second = validateDocument(ctx, input);
    expect(second.getValid()).toBe(first.getValid());
    expect(second.getViolationsList().length).toBe(first.getViolationsList().length);
  });
});
