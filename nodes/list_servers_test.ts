import { DocumentInput } from '../gen/messages_pb';
import { listServers } from './list_servers';
import { ctx, FULL_DOC_JSON, MALFORMED_JSON } from './testkit';

describe('ListServers', () => {
  it('extracts the server, including its declared variable', () => {
    const input = new DocumentInput();
    input.setDocument(FULL_DOC_JSON);
    const result = listServers(ctx, input);
    const servers = result.getServersList();
    expect(servers.length).toBe(1);
    const s = servers[0];
    expect(s.getName()).toBe('production');
    expect(s.getUrl()).toBe('https://api.example.com/{env}');
    expect(s.getSummary()).toBe('Production server');
    const vars = s.getVariablesList();
    expect(vars.length).toBe(1);
    expect(vars[0].getName()).toBe('env');
    expect(vars[0].getDefaultValue()).toBe('v1');
    expect(vars[0].getEnumValuesList()).toEqual(['v1', 'v2']);
  });

  it('returns an empty list (not an error) for a document with no servers array', () => {
    const input = new DocumentInput();
    input.setDocument(JSON.stringify({ openrpc: '1.2.6', info: { title: 't', version: '1' }, methods: [] }));
    const result = listServers(ctx, input);
    expect(result.getServersList()).toEqual([]);
    expect(result.getError()).toBe('');
  });

  it('returns a structured error for malformed JSON, not a crash', () => {
    const input = new DocumentInput();
    input.setDocument(MALFORMED_JSON);
    const result = listServers(ctx, input);
    expect(result.getError()).toContain('JSON');
  });
});
