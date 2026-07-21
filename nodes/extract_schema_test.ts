import { ExtractSchemaInput } from '../gen/messages_pb';
import { extractSchema } from './extract_schema';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractSchema', () => {
  it('extracts a simple named schema as compact JSON', () => {
    const input = new ExtractSchemaInput();
    input.setDocument(FULL_DOC_JSON);
    input.setSchemaName('UserId');
    const result = extractSchema(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getSchemaJson()).toBe('{"type":"string"}');
  });

  it('extracts a schema containing a nested internal $ref, unresolved (as literal JSON)', () => {
    const input = new ExtractSchemaInput();
    input.setDocument(FULL_DOC_JSON);
    input.setSchemaName('User');
    const result = extractSchema(ctx, input);
    expect(result.getFound()).toBe(true);
    const parsed = JSON.parse(result.getSchemaJson());
    expect(parsed.properties.id.$ref).toBe('#/components/schemas/UserId');
    expect(parsed.properties.name).toEqual({ type: 'string' });
    expect(parsed.required).toEqual(['id', 'name']);
  });

  it('found=false for a schema name that is not registered', () => {
    const input = new ExtractSchemaInput();
    input.setDocument(FULL_DOC_JSON);
    input.setSchemaName('DoesNotExist');
    const result = extractSchema(ctx, input);
    expect(result.getFound()).toBe(false);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new ExtractSchemaInput();
    input.setDocument(MALFORMED_JSON);
    input.setSchemaName('UserId');
    const result = extractSchema(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toContain('JSON');
  });
});
