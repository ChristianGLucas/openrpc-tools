// Direct tests of lib.ts's safety bounds — the input-size and
// nesting-depth guards that a realistic OpenRPC document would never
// trigger, but that stand between this package and a crash/hang on
// adversarial input. See the node-level tests for the ordinary behavior.

import { parseDocumentText, OpenRPCError, MAX_INPUT_BYTES, MAX_INPUT_DEPTH } from './lib';

describe('lib safety bounds', () => {
  it('rejects a document over the byte-size limit before parsing it', () => {
    const huge = JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [], padding: 'x'.repeat(MAX_INPUT_BYTES + 1) });
    expect(() => parseDocumentText(huge)).toThrow(OpenRPCError);
    expect(() => parseDocumentText(huge)).toThrow(/exceeding/);
  });

  it('rejects pathologically deep nesting instead of crashing (native JSON.parse RangeError caught, or our own depth check)', () => {
    // 100,000 levels of array nesting: small in bytes, but enough to
    // either throw a RangeError inside JSON.parse itself or fail our own
    // MAX_INPUT_DEPTH check — both paths must surface as a clean
    // OpenRPCError, never an unhandled exception or a process crash.
    const deep = '['.repeat(100_000) + ']'.repeat(100_000);
    expect(() => parseDocumentText(deep)).toThrow(OpenRPCError);
  });

  it('accepts nesting comfortably under the depth limit', () => {
    // Array wrapping adds exactly one depth level per iteration (unlike
    // `{ properties: { nested: obj } }`, which nests two keys — and so two
    // levels — per iteration); leaving a fixed, generous margin below
    // MAX_INPUT_DEPTH for the few levels the surrounding document
    // structure itself adds (doc -> components -> schemas -> Deep -> ...).
    let obj: any = 'leaf';
    for (let i = 0; i < MAX_INPUT_DEPTH - 20; i++) {
      obj = [obj];
    }
    const doc = { openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [], components: { schemas: { Deep: obj } } };
    expect(() => parseDocumentText(JSON.stringify(doc))).not.toThrow();
  });

  it('rejects an empty string', () => {
    expect(() => parseDocumentText('')).toThrow(OpenRPCError);
  });

  it('rejects a bare JSON scalar (not an object)', () => {
    expect(() => parseDocumentText('"just a string"')).toThrow(OpenRPCError);
    expect(() => parseDocumentText('42')).toThrow(OpenRPCError);
    expect(() => parseDocumentText('null')).toThrow(OpenRPCError);
  });
});
