// Converts the plain-object shapes produced by lib.ts into their protobuf
// message instances. Kept separate from lib.ts so the extraction logic
// itself stays protobuf-free and trivially unit-testable.

import { ContentDescriptor, ErrorObject, DocError } from '../gen/messages_pb';
import { ContentDescriptorOut, ErrorOut } from './lib';

export function toContentDescriptorMsg(cd: ContentDescriptorOut): ContentDescriptor {
  const m = new ContentDescriptor();
  m.setName(cd.name);
  m.setSummary(cd.summary);
  m.setDescription(cd.description);
  m.setRequired(cd.required);
  m.setDeprecated(cd.deprecated);
  m.setSchemaJson(cd.schemaJson);
  m.setRefTarget(cd.refTarget);
  return m;
}

export function toErrorObjectMsg(e: ErrorOut): ErrorObject {
  const m = new ErrorObject();
  m.setCode(e.code);
  m.setMessage(e.message);
  m.setDataSchemaJson(e.dataSchemaJson);
  m.setRefTarget(e.refTarget);
  m.setComponentName(e.componentName);
  return m;
}

export function toDocErrorMsg(message: string, path = ''): DocError {
  const m = new DocError();
  m.setMessage(message);
  m.setPath(path);
  return m;
}
