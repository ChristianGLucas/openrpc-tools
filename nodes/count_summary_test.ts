import { DocumentInput } from '../gen/messages_pb';
import { countSummary } from './count_summary';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('CountSummary', () => {
  it('hand-counted oracle: matches every count derived directly from the fixture', () => {
    // Hand-counted directly from FULL_DOC in testkit.ts, independent of the
    // node's own counting logic:
    //   methods: add, getUser, ping, deleteAll                    = 4
    //   components.schemas: UserId, User                          = 2
    //   servers: one entry                                        = 1
    //   distinct tags in use: "users" (inline) + "beta" (both the
    //     $ref'd usage, resolved, and the components.tags key)     = 2
    //   components.contentDescriptors: Force                      = 1
    //   components.errors: AuthError                               = 1
    //   components.examples: SampleUser                            = 1
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = countSummary(ctx, input);
    expect(result.getMethodCount()).toBe(4);
    expect(result.getSchemaCount()).toBe(2);
    expect(result.getServerCount()).toBe(1);
    expect(result.getTagCount()).toBe(2);
    expect(result.getContentDescriptorCount()).toBe(1);
    expect(result.getErrorDefinitionCount()).toBe(1);
    expect(result.getExampleCount()).toBe(1);
  });

  it('reports all zero counts (not an error) for a minimal document', () => {
    const input = new DocumentInput();
    input.setDocument(JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [] }));
    const result = countSummary(ctx, input);
    expect(result.getMethodCount()).toBe(0);
    expect(result.getSchemaCount()).toBe(0);
    expect(result.getServerCount()).toBe(0);
    expect(result.getTagCount()).toBe(0);
    expect(result.getError()).toBe('');
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = countSummary(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
