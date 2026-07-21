import { DocumentInput } from '../gen/messages_pb';
import { parseDocument } from './parse_document';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON, NOT_AN_OBJECT_JSON, MISSING_TOP_LEVEL_FIELDS_JSON } from './testkit';

describe('ParseDocument', () => {
  it('reports the correct shape and counts for a real document', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = parseDocument(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getOpenrpcVersion()).toBe('1.2.6');
    expect(result.getMethodCount()).toBe(4);
    expect(result.getSchemaCount()).toBe(2);
    expect(result.getServerCount()).toBe(1);
  });

  it('returns valid=false with a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = parseDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getError()?.getMessage()).toContain('JSON');
  });

  it('rejects a top-level JSON array', () => {
    const input = new DocumentInput();
    input.setDocument(NOT_AN_OBJECT_JSON);
    const result = parseDocument(ctx, input);
    expect(result.getValid()).toBe(false);
  });

  it('reports every missing required top-level field by name', () => {
    const input = new DocumentInput();
    input.setDocument(MISSING_TOP_LEVEL_FIELDS_JSON);
    const result = parseDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    const msg = result.getError()?.getMessage() || '';
    expect(msg).toContain('openrpc');
    expect(msg).toContain('info');
    expect(msg).toContain('methods');
  });

  it('rejects empty input', () => {
    const input = new DocumentInput();
    input.setDocument('');
    const result = parseDocument(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
