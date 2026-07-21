// Shared fixtures and AxiomContext test double for every node test in this
// package. Centralizing these means every node's test exercises the SAME
// realistic document — a single well-understood fixture whose every field
// a test can reason about, rather than each test inventing its own
// ad hoc shape.

import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const testReflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const testMutation: AxiomMutation = {
  flow: {
    addNode: (_packageName: string, _packageVersion: string) => 0,
    addEdge: (_srcInstance: number, _dstInstance: number) => {},
  },
};

export const ctx: AxiomContext = {
  log: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  } satisfies AxiomLogger,
  secrets: {
    get: (_name: string): [string, boolean] => ['', false],
  } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection: testReflection,
  mutation: testMutation,
};

// A realistic, multi-feature OpenRPC document. Exercises: an inline-schema
// method with no tags and a default (unset) paramStructure ("add"); a
// method with $ref'd params/errors/tags, an explicit paramStructure, a
// deprecated flag, and a named example ("getUser"); a notification method
// with no "result" at all ("ping"); a method whose entire param entry is a
// bare Reference Object rather than an inline Content Descriptor
// ("deleteAll"); a nested internal $ref inside a component schema
// (User.properties.id -> UserId); every components.* category populated;
// servers with a variable.
export const FULL_DOC = {
  openrpc: '1.2.6',
  info: {
    title: 'Demo API',
    version: '1.0.0',
    description: 'A demo JSON-RPC API for testing openrpc-tools.',
    termsOfService: 'https://example.com/terms',
    contact: { name: 'API Team', url: 'https://example.com', email: 'api@example.com' },
    license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
  },
  servers: [
    {
      name: 'production',
      url: 'https://api.example.com/{env}',
      summary: 'Production server',
      description: 'The main production endpoint.',
      variables: {
        env: { default: 'v1', enum: ['v1', 'v2'], description: 'API version segment.' },
      },
    },
  ],
  methods: [
    {
      name: 'add',
      summary: 'Add two numbers',
      description: 'Returns the sum of a and b.',
      params: [
        { name: 'a', schema: { type: 'number' }, required: true },
        { name: 'b', schema: { type: 'number' }, required: true },
      ],
      result: { name: 'sum', schema: { type: 'number' } },
    },
    {
      name: 'getUser',
      summary: 'Fetch a user',
      description: 'Fetches a user by id.',
      deprecated: true,
      paramStructure: 'by-name',
      params: [{ name: 'id', schema: { $ref: '#/components/schemas/UserId' }, required: true }],
      result: { name: 'user', schema: { $ref: '#/components/schemas/User' } },
      errors: [{ code: 404, message: 'Not found', data: { type: 'string' } }, { $ref: '#/components/errors/AuthError' }],
      tags: [{ name: 'users' }, { $ref: '#/components/tags/beta' }],
      examples: [
        {
          name: 'ex1',
          description: 'A basic lookup.',
          params: [{ name: 'id', value: 'u1' }],
          result: { name: 'user', value: { id: 'u1', name: 'Alice' } },
        },
      ],
    },
    {
      name: 'ping',
      summary: 'no-op',
      params: [],
    },
    {
      name: 'deleteAll',
      params: [{ $ref: '#/components/contentDescriptors/Force' }],
      result: { name: 'ok', schema: { type: 'boolean' } },
    },
  ],
  components: {
    schemas: {
      UserId: { type: 'string' },
      User: {
        type: 'object',
        properties: { id: { $ref: '#/components/schemas/UserId' }, name: { type: 'string' } },
        required: ['id', 'name'],
      },
    },
    contentDescriptors: {
      Force: { name: 'force', schema: { type: 'boolean' }, required: false },
    },
    errors: {
      AuthError: { code: -32001, message: 'Unauthorized' },
    },
    examples: {
      SampleUser: { name: 'SampleUser', value: { id: 'u1', name: 'Alice' } },
    },
    examplePairings: {},
    links: {},
    tags: {
      beta: { name: 'beta', description: 'A beta feature.' },
    },
  },
};
export const FULL_DOC_JSON = JSON.stringify(FULL_DOC);

// A schema that refs itself through one level of indirection — used to
// prove DereferenceDocument detects and reports a cycle instead of looping
// forever or crashing.
export const CIRCULAR_DOC_JSON = JSON.stringify({
  openrpc: '1.2.6',
  info: { title: 'Circular', version: '1.0.0' },
  methods: [{ name: 'm', params: [{ name: 'p', schema: { $ref: '#/components/schemas/Node' } }], result: { name: 'r', schema: { type: 'string' } } }],
  components: { schemas: { Node: { type: 'object', properties: { child: { $ref: '#/components/schemas/Node' } } } } },
});

// A method param whose schema is an EXTERNAL (http) $ref — must never be
// fetched, always left in place and reported.
export const EXTERNAL_REF_DOC_JSON = JSON.stringify({
  openrpc: '1.2.6',
  info: { title: 'External', version: '1.0.0' },
  methods: [{ name: 'm', params: [{ name: 'p', schema: { $ref: 'https://example.com/schema.json#/Foo' } }], result: { name: 'r', schema: { type: 'string' } } }],
});

// A method param whose schema $refs a components.schemas entry that does
// not exist — a dangling internal ref.
export const DANGLING_REF_DOC_JSON = JSON.stringify({
  openrpc: '1.2.6',
  info: { title: 'Dangling', version: '1.0.0' },
  methods: [{ name: 'm', params: [{ name: 'p', schema: { $ref: '#/components/schemas/DoesNotExist' } }], result: { name: 'r', schema: { type: 'string' } } }],
});

// A non-circular chain of four indirections (A -> B -> C -> D), used to
// prove DereferenceDocument's max_depth bound stops resolution at the
// requested depth (and reports it via circular_refs) even though there is
// no true cycle here.
export const DEPTH_CHAIN_DOC_JSON = JSON.stringify({
  openrpc: '1.2.6',
  info: { title: 'Chain', version: '1.0.0' },
  methods: [{ name: 'm', params: [{ name: 'p', schema: { $ref: '#/components/schemas/A' } }], result: { name: 'r', schema: { type: 'string' } } }],
  components: {
    schemas: {
      A: { $ref: '#/components/schemas/B' },
      B: { $ref: '#/components/schemas/C' },
      C: { $ref: '#/components/schemas/D' },
      D: { type: 'string' },
    },
  },
});

export const MALFORMED_JSON = '{ this is not valid json';
export const NOT_AN_OBJECT_JSON = '[1, 2, 3]';
export const MISSING_TOP_LEVEL_FIELDS_JSON = JSON.stringify({ foo: 'bar' });

// A document that is syntactically fine JSON and has openrpc/info/methods,
// but methods[0] is missing "params" (required by the meta-schema) —
// exercises ValidateDocument finding a real spec violation beyond what
// ParseDocument's lightweight shape check would catch.
export const SPEC_INVALID_DOC_JSON = JSON.stringify({
  openrpc: '1.2.6',
  info: { title: 'Invalid', version: '1.0.0' },
  methods: [{ name: 'noParams' }],
});
