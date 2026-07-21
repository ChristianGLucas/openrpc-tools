import { DocumentInput } from '../gen/messages_pb';
import { extractComponents } from './extract_components';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ExtractComponents', () => {
  it('lists the key names in every populated components category', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = extractComponents(ctx, input);
    expect(result.getSchemaNamesList().sort()).toEqual(['User', 'UserId']);
    expect(result.getContentDescriptorNamesList()).toEqual(['Force']);
    expect(result.getErrorNamesList()).toEqual(['AuthError']);
    expect(result.getExampleNamesList()).toEqual(['SampleUser']);
    expect(result.getExamplePairingNamesList()).toEqual([]);
    expect(result.getLinkNamesList()).toEqual([]);
    expect(result.getTagNamesList()).toEqual(['beta']);
  });

  it('reports every list empty (not an error) when "components" is absent', () => {
    const input = new DocumentInput();
    input.setDocument(JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [] }));
    const result = extractComponents(ctx, input);
    expect(result.getSchemaNamesList()).toEqual([]);
    expect(result.getError()).toBe('');
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = extractComponents(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
