import { DocumentInput } from '../gen/messages_pb';
import { extractInfo } from './extract_info';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON, MISSING_TOP_LEVEL_FIELDS_JSON } from './testkit';

describe('ExtractInfo', () => {
  it('extracts every info field, including nested contact and license', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = extractInfo(ctx, input);
    expect(result.getFound()).toBe(true);
    const info = result.getInfo()!;
    expect(info.getTitle()).toBe('Demo API');
    expect(info.getVersion()).toBe('1.0.0');
    expect(info.getDescription()).toBe('A demo JSON-RPC API for testing openrpc-tools.');
    expect(info.getTermsOfService()).toBe('https://example.com/terms');
    expect(info.getContact()!.getName()).toBe('API Team');
    expect(info.getContact()!.getEmail()).toBe('api@example.com');
    expect(info.getLicense()!.getName()).toBe('MIT');
    expect(info.getLicense()!.getUrl()).toBe('https://opensource.org/licenses/MIT');
  });

  it('found=false when the document has no "info" object', () => {
    const input = new DocumentInput();
    input.setDocument(MISSING_TOP_LEVEL_FIELDS_JSON);
    const result = extractInfo(ctx, input);
    expect(result.getFound()).toBe(false);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = extractInfo(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toContain('JSON');
  });
});
