import { DocumentInput, ListServersOutput, ServerInfo, ServerVariable } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, OpenRPCError } from './lib';

/**
 * Lists the document's top-level "servers" array: each server's url, name,
 * summary, description, and declared variables (with default value, enum
 * of allowed values, and description). Returns an empty list — not an
 * error — for a document that declares no servers at all, which is
 * spec-legal.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listServers(ax: AxiomContext, input: DocumentInput): ListServersOutput {
  const out = new ListServersOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const servers = Array.isArray(doc.servers) ? doc.servers : [];
  out.setServersList(
    servers
      .filter((s: any) => s && typeof s === 'object')
      .map((s: any) => {
        const m = new ServerInfo();
        m.setName(typeof s.name === 'string' ? s.name : '');
        m.setUrl(typeof s.url === 'string' ? s.url : '');
        m.setSummary(typeof s.summary === 'string' ? s.summary : '');
        m.setDescription(typeof s.description === 'string' ? s.description : '');
        const variables = s.variables && typeof s.variables === 'object' ? s.variables : {};
        m.setVariablesList(
          Object.keys(variables).map((varName) => {
            const v = variables[varName] && typeof variables[varName] === 'object' ? variables[varName] : {};
            const vm = new ServerVariable();
            vm.setName(varName);
            vm.setDefaultValue(typeof v.default === 'string' ? v.default : '');
            vm.setEnumValuesList(Array.isArray(v.enum) ? v.enum.filter((e: any) => typeof e === 'string') : []);
            vm.setDescription(typeof v.description === 'string' ? v.description : '');
            return vm;
          }),
        );
        return m;
      }),
  );
  return out;
}
