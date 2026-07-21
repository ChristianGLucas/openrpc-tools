import { DocumentInput, ExtractInfoOutput, InfoBlock, ContactInfo, LicenseInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, OpenRPCError } from './lib';

/**
 * Extracts the document's "info" block: title, version, description,
 * termsOfService, and the nested contact/license objects. `found` is
 * false when the document has no "info" object at all (or the input
 * isn't a parseable OpenRPC document) — ValidateDocument/ParseDocument
 * report the structural reason why; this node only extracts.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractInfo(ax: AxiomContext, input: DocumentInput): ExtractInfoOutput {
  const out = new ExtractInfoOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setFound(false);
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const info = doc.info;
  if (!info || typeof info !== 'object') {
    out.setFound(false);
    return out;
  }

  const block = new InfoBlock();
  block.setTitle(typeof info.title === 'string' ? info.title : '');
  block.setVersion(typeof info.version === 'string' ? info.version : '');
  block.setDescription(typeof info.description === 'string' ? info.description : '');
  block.setTermsOfService(typeof info.termsOfService === 'string' ? info.termsOfService : '');

  if (info.contact && typeof info.contact === 'object') {
    const c = new ContactInfo();
    c.setName(typeof info.contact.name === 'string' ? info.contact.name : '');
    c.setUrl(typeof info.contact.url === 'string' ? info.contact.url : '');
    c.setEmail(typeof info.contact.email === 'string' ? info.contact.email : '');
    block.setContact(c);
  }
  if (info.license && typeof info.license === 'object') {
    const l = new LicenseInfo();
    l.setName(typeof info.license.name === 'string' ? info.license.name : '');
    l.setUrl(typeof info.license.url === 'string' ? info.license.url : '');
    block.setLicense(l);
  }

  out.setFound(true);
  out.setInfo(block);
  return out;
}
