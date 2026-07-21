import { MethodNameInput, ExtractMethodOutput, MethodDetail, MethodExample } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocumentText, findMethod, toContentDescriptor, toErrorObject, methodTagNames, resolveParamStructure, boundedStringify, OpenRPCError } from './lib';
import { toContentDescriptorMsg, toErrorObjectMsg } from './msg';

/**
 * Extracts one method's full detail by its declared "name": params (each
 * with its schema or $ref target), result, declared errors, tags,
 * deprecated flag, param-passing structure, and any named examples.
 * `found` is false when no method with that name exists in the document.
 * A $ref appearing anywhere in this method (a referenced param, result,
 * error, or schema) is reported via its ref_target field and never
 * resolved here — use DereferenceDocument or ExtractRefs for that.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMethod(ax: AxiomContext, input: MethodNameInput): ExtractMethodOutput {
  const out = new ExtractMethodOutput();
  let doc: any;
  try {
    doc = parseDocumentText(input.getDocument());
  } catch (e: any) {
    out.setFound(false);
    out.setError(e instanceof OpenRPCError ? e.message : String(e?.message || e));
    return out;
  }

  const raw = findMethod(doc, input.getMethodName());
  if (!raw) {
    out.setFound(false);
    return out;
  }

  const detail = new MethodDetail();
  detail.setName(typeof raw.name === 'string' ? raw.name : '');
  detail.setSummary(typeof raw.summary === 'string' ? raw.summary : '');
  detail.setDescription(typeof raw.description === 'string' ? raw.description : '');
  detail.setDeprecated(!!raw.deprecated);

  const params = Array.isArray(raw.params) ? raw.params : [];
  detail.setParamsList(params.map((p: any) => toContentDescriptorMsg(toContentDescriptor(p))));

  if (raw.result !== undefined) {
    detail.setResult(toContentDescriptorMsg(toContentDescriptor(raw.result)));
  }

  const errors = Array.isArray(raw.errors) ? raw.errors : [];
  detail.setErrorsList(errors.map((e: any) => toErrorObjectMsg(toErrorObject(e))));

  detail.setTagsList(methodTagNames(doc, raw));

  const { value: paramStructure } = resolveParamStructure(raw);
  detail.setParamStructure(paramStructure);

  const examples = Array.isArray(raw.examples) ? raw.examples : [];
  detail.setExamplesList(
    examples
      .filter((ex: any) => ex && typeof ex === 'object')
      .map((ex: any) => {
        const m = new MethodExample();
        m.setName(typeof ex.name === 'string' ? ex.name : '');
        m.setDescription(typeof ex.description === 'string' ? ex.description : '');
        m.setParamsJson(ex.params !== undefined ? boundedStringify(ex.params) : '');
        m.setResultJson(ex.result !== undefined ? boundedStringify(ex.result) : '');
        return m;
      }),
  );

  out.setFound(true);
  out.setMethod(detail);
  return out;
}
