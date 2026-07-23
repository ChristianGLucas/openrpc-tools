# openrpc-tools

Deterministic parsing, validation, and structural inspection of [OpenRPC](https://spec.open-rpc.org)
documents — the JSON-RPC 2.0 API description specification, the JSON-RPC
counterpart to OpenAPI. Built for the Axiom marketplace
(`christiangeorgelucas/openrpc-tools`).

Validation wraps [Ajv](https://ajv.js.org) (MIT) against the official
[`@open-rpc/meta-schema`](https://github.com/open-rpc/meta-schema)
(Apache-2.0), composed with its sibling
[`@json-schema-tools/meta-schema`](https://github.com/json-schema-tools/meta-schema)
(Apache-2.0) — the OpenRPC meta-schema's own documented design delegates
"what is a valid JSON Schema value" to that package. Every other node
(listing, extraction, dereferencing) treats the document as JSON and applies
hand-written, spec-aware structural extraction — the OpenRPC document shape
(info/methods/params/result/errors/servers/components) is simple and
well-defined enough that this is honest glue, not a reimplementation of an
algorithm a library should own.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/openrpc-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/openrpc-tools/ParseDocument --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/openrpc-tools/0.1.0/ParseDocument \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/openrpc-tools/ParseDocument`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## Security & determinism contract

- The document is **always** supplied as caller text (JSON — OpenRPC, unlike
  OpenAPI, has no YAML variant). No node ever fetches a document over the
  network or the filesystem.
- A `$ref` is **never** resolved unless it is an internal, same-document JSON
  Pointer (`#/...`). Any other form (an `http(s)` URL, a bare file path, a
  relative path) is external and is always left untouched in the output and
  reported back (`ExtractRefs`, `DereferenceDocument`'s
  `unresolved_remote_refs`) — never fetched.
- Meta-schema validation runs entirely offline: the meta-schema and its
  dependency are both vendored npm packages, compiled once with Ajv.
- Every node bounds raw input size (3 MiB, under Axiom's node transport
  cap) and parsed-structure nesting depth before doing real work, so a
  malformed or adversarial document returns a structured error instead of
  hanging, crashing, or exhausting memory. `DereferenceDocument`'s internal
  `$ref`-chain resolution is separately bounded (`max_depth`, clamped to
  [1, 200]) with explicit cycle detection — a circular reference is reported,
  never infinitely followed.
- No node uses the wall clock or any source of randomness — every node is a
  pure, deterministic single-input -> single-output transform.

## Nodes (16)

| Node | What it does |
|---|---|
| `ParseDocument` | Lightweight structural parse: confirms the minimum OpenRPC shape and reports top-level counts |
| `ValidateDocument` | Full conformance check against the official OpenRPC meta-schema, with located violations |
| `ExtractInfo` | Extract the `info` block (title, version, description, contact, license) |
| `ListMethods` | List every method: name, summary, param names, result name, tags |
| `ExtractMethod` | Full detail for one method by name: params, result, errors, tags, examples |
| `ExtractMethodParams` | One method's parameter list, with schemas or `$ref` targets |
| `ExtractMethodResult` | One method's result content descriptor |
| `ExtractErrors` | Declared JSON-RPC errors, global (`components.errors`) and per-method |
| `ListServers` | The document's `servers` array, including declared variables |
| `ExtractComponents` | Key names in every `components.*` category (schemas, contentDescriptors, errors, examples, examplePairings, links, tags) |
| `ExtractSchema` | One named schema from `components.schemas`, as JSON text |
| `ExtractRefs` | Every `$ref` in the document, with its location — reported, never fetched |
| `DereferenceDocument` | Inline every internal `$ref`, recursively, with cycle/depth-bound detection |
| `GroupMethodsByTag` | Methods grouped by declared tag, plus an untagged group |
| `DetectParamStructure` | A method's `paramStructure` (`by-name` / `by-position` / `either`), explicit or spec-defaulted |
| `CountSummary` | Document-wide capability counts (methods, schemas, servers, tags, ...) |

## License

MIT — see [LICENSE](./LICENSE).
