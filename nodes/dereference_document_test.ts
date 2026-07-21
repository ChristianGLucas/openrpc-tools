import { DereferenceInput } from '../gen/messages_pb';
import { dereferenceDocument } from './dereference_document';
import { ctx, FULL_DOC_JSON, CIRCULAR_DOC_JSON, EXTERNAL_REF_DOC_JSON, DANGLING_REF_DOC_JSON, DEPTH_CHAIN_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('DereferenceDocument', () => {
  it('inlines every internal $ref, recursively, including nested refs inside a resolved schema', () => {
    const input = new DereferenceInput();
    input.setDocument(FULL_DOC_JSON);
    const result = dereferenceDocument(ctx, input);
    expect(result.getError()).toBe('');
    const doc = JSON.parse(result.getDocumentJson());

    // UserId inlined directly.
    expect(doc.methods[1].params[0].schema).toEqual({ type: 'string' });
    // User inlined, AND its own nested $ref to UserId recursively inlined too.
    expect(doc.methods[1].result.schema).toEqual({
      type: 'object',
      properties: { id: { type: 'string' }, name: { type: 'string' } },
      required: ['id', 'name'],
    });
    // AuthError (a components.errors ref) inlined.
    expect(doc.methods[1].errors[1]).toEqual({ code: -32001, message: 'Unauthorized' });
    // The 'beta' tag ref inlined.
    expect(doc.methods[1].tags[1]).toEqual({ name: 'beta', description: 'A beta feature.' });
    // The Force content-descriptor ref inlined.
    expect(doc.methods[3].params[0]).toEqual({ name: 'force', schema: { type: 'boolean' }, required: false });

    expect(result.getUnresolvedRemoteRefsList()).toEqual([]);
    expect(result.getCircularRefsList()).toEqual([]);
  });

  it('detects a true $ref cycle: leaves the cyclic $ref in place and reports it, never loops forever', () => {
    const input = new DereferenceInput();
    input.setDocument(CIRCULAR_DOC_JSON);
    const result = dereferenceDocument(ctx, input);
    expect(result.getError()).toBe('');
    const doc = JSON.parse(result.getDocumentJson());
    expect(doc.methods[0].params[0].schema).toEqual({
      type: 'object',
      properties: { child: { $ref: '#/components/schemas/Node' } },
    });
    expect(result.getCircularRefsList()).toEqual(['#/components/schemas/Node']);
    expect(result.getUnresolvedRemoteRefsList()).toEqual([]);
  });

  it('independent oracle: a max_depth of 2 stops a non-circular 4-link chain at the right link on every path that walks it', () => {
    // Dereferencing walks the WHOLE document, not just refs reachable from
    // methods — so this chain (A -> B -> C -> D) is actually walked from
    // two independent starting points, each hitting the depth-2 bound at
    // a different link because each starts at a different phase-offset in
    // the same underlying chain:
    //   1. methods[0].params[0].schema = {$ref: A}. Hop 1 resolves A ->
    //      {$ref: B} (chain size now 1, still < 2). Hop 2 resolves B ->
    //      {$ref: C} (chain size now 2). The 3rd hop, for C, is blocked
    //      (chain.size 2 >= max_depth 2 checked BEFORE resolving) — C is
    //      left unresolved and reported.
    //   2. components.schemas.A is ALSO visited directly as ordinary
    //      document content (it's the map entry itself, not a usage) —
    //      its own value is already {$ref: B}, one hop closer to the
    //      cutoff than the params path started. Hop 1 resolves B ->
    //      {$ref: C} (chain size 1). Hop 2 resolves C -> {$ref: D} (chain
    //      size 2). The 3rd hop, for D, is blocked the same way — D is
    //      left unresolved and reported. (schemas.B and schemas.C, walked
    //      the same way, each only need <=2 hops to fully resolve to D's
    //      leaf {"type":"string"}, so they hit no bound.)
    const input = new DereferenceInput();
    input.setDocument(DEPTH_CHAIN_DOC_JSON);
    input.setMaxDepth(2);
    const result = dereferenceDocument(ctx, input);
    expect(result.getError()).toBe('');
    const doc = JSON.parse(result.getDocumentJson());
    expect(doc.methods[0].params[0].schema).toEqual({ $ref: '#/components/schemas/C' });
    expect(doc.components.schemas.A).toEqual({ $ref: '#/components/schemas/D' });
    expect(doc.components.schemas.B).toEqual({ type: 'string' });
    expect(doc.components.schemas.C).toEqual({ type: 'string' });
    expect(result.getCircularRefsList().slice().sort()).toEqual(['#/components/schemas/C', '#/components/schemas/D']);
  });

  it('a larger max_depth resolves the same non-circular chain all the way through', () => {
    const input = new DereferenceInput();
    input.setDocument(DEPTH_CHAIN_DOC_JSON);
    input.setMaxDepth(10);
    const result = dereferenceDocument(ctx, input);
    const doc = JSON.parse(result.getDocumentJson());
    expect(doc.methods[0].params[0].schema).toEqual({ type: 'string' });
    expect(result.getCircularRefsList()).toEqual([]);
  });

  it('never fetches an external $ref: leaves it in place and reports it in unresolved_remote_refs', () => {
    const input = new DereferenceInput();
    input.setDocument(EXTERNAL_REF_DOC_JSON);
    const result = dereferenceDocument(ctx, input);
    const doc = JSON.parse(result.getDocumentJson());
    expect(doc.methods[0].params[0].schema).toEqual({ $ref: 'https://example.com/schema.json#/Foo' });
    expect(result.getUnresolvedRemoteRefsList()).toEqual(['https://example.com/schema.json#/Foo']);
    expect(result.getCircularRefsList()).toEqual([]);
  });

  it('leaves a dangling internal $ref (points nowhere) untouched, without crashing or misreporting it', () => {
    const input = new DereferenceInput();
    input.setDocument(DANGLING_REF_DOC_JSON);
    const result = dereferenceDocument(ctx, input);
    const doc = JSON.parse(result.getDocumentJson());
    expect(doc.methods[0].params[0].schema).toEqual({ $ref: '#/components/schemas/DoesNotExist' });
    expect(result.getUnresolvedRemoteRefsList()).toEqual([]);
    expect(result.getCircularRefsList()).toEqual([]);
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DereferenceInput();
    input.setDocument(MALFORMED_JSON);
    const result = dereferenceDocument(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
