// package: christiangeorgelucas.openrpc_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class DocumentInput extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentInput.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentInput): DocumentInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentInput;
  static deserializeBinaryFromReader(message: DocumentInput, reader: jspb.BinaryReader): DocumentInput;
}

export namespace DocumentInput {
  export type AsObject = {
    document: string,
  }
}

export class DocError extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getPath(): string;
  setPath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocError.AsObject;
  static toObject(includeInstance: boolean, msg: DocError): DocError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocError;
  static deserializeBinaryFromReader(message: DocError, reader: jspb.BinaryReader): DocError;
}

export namespace DocError {
  export type AsObject = {
    message: string,
    path: string,
  }
}

export class ParseDocumentOutput extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  getOpenrpcVersion(): string;
  setOpenrpcVersion(value: string): void;

  getMethodCount(): number;
  setMethodCount(value: number): void;

  getSchemaCount(): number;
  setSchemaCount(value: number): void;

  getServerCount(): number;
  setServerCount(value: number): void;

  hasError(): boolean;
  clearError(): void;
  getError(): DocError | undefined;
  setError(value?: DocError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseDocumentOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseDocumentOutput): ParseDocumentOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseDocumentOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseDocumentOutput;
  static deserializeBinaryFromReader(message: ParseDocumentOutput, reader: jspb.BinaryReader): ParseDocumentOutput;
}

export namespace ParseDocumentOutput {
  export type AsObject = {
    valid: boolean,
    openrpcVersion: string,
    methodCount: number,
    schemaCount: number,
    serverCount: number,
    error?: DocError.AsObject,
  }
}

export class ValidationViolation extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getInstancePath(): string;
  setInstancePath(value: string): void;

  getKeywordPath(): string;
  setKeywordPath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationViolation.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationViolation): ValidationViolation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationViolation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationViolation;
  static deserializeBinaryFromReader(message: ValidationViolation, reader: jspb.BinaryReader): ValidationViolation;
}

export namespace ValidationViolation {
  export type AsObject = {
    message: string,
    instancePath: string,
    keywordPath: string,
  }
}

export class ValidateDocumentOutput extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearViolationsList(): void;
  getViolationsList(): Array<ValidationViolation>;
  setViolationsList(value: Array<ValidationViolation>): void;
  addViolations(value?: ValidationViolation, index?: number): ValidationViolation;

  getParseError(): string;
  setParseError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateDocumentOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateDocumentOutput): ValidateDocumentOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateDocumentOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateDocumentOutput;
  static deserializeBinaryFromReader(message: ValidateDocumentOutput, reader: jspb.BinaryReader): ValidateDocumentOutput;
}

export namespace ValidateDocumentOutput {
  export type AsObject = {
    valid: boolean,
    violationsList: Array<ValidationViolation.AsObject>,
    parseError: string,
  }
}

export class ContactInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getUrl(): string;
  setUrl(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ContactInfo): ContactInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContactInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactInfo;
  static deserializeBinaryFromReader(message: ContactInfo, reader: jspb.BinaryReader): ContactInfo;
}

export namespace ContactInfo {
  export type AsObject = {
    name: string,
    url: string,
    email: string,
  }
}

export class LicenseInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getUrl(): string;
  setUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LicenseInfo.AsObject;
  static toObject(includeInstance: boolean, msg: LicenseInfo): LicenseInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LicenseInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LicenseInfo;
  static deserializeBinaryFromReader(message: LicenseInfo, reader: jspb.BinaryReader): LicenseInfo;
}

export namespace LicenseInfo {
  export type AsObject = {
    name: string,
    url: string,
  }
}

export class InfoBlock extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getTermsOfService(): string;
  setTermsOfService(value: string): void;

  hasContact(): boolean;
  clearContact(): void;
  getContact(): ContactInfo | undefined;
  setContact(value?: ContactInfo): void;

  hasLicense(): boolean;
  clearLicense(): void;
  getLicense(): LicenseInfo | undefined;
  setLicense(value?: LicenseInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InfoBlock.AsObject;
  static toObject(includeInstance: boolean, msg: InfoBlock): InfoBlock.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InfoBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InfoBlock;
  static deserializeBinaryFromReader(message: InfoBlock, reader: jspb.BinaryReader): InfoBlock;
}

export namespace InfoBlock {
  export type AsObject = {
    title: string,
    version: string,
    description: string,
    termsOfService: string,
    contact?: ContactInfo.AsObject,
    license?: LicenseInfo.AsObject,
  }
}

export class ExtractInfoOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  hasInfo(): boolean;
  clearInfo(): void;
  getInfo(): InfoBlock | undefined;
  setInfo(value?: InfoBlock): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractInfoOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractInfoOutput): ExtractInfoOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractInfoOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractInfoOutput;
  static deserializeBinaryFromReader(message: ExtractInfoOutput, reader: jspb.BinaryReader): ExtractInfoOutput;
}

export namespace ExtractInfoOutput {
  export type AsObject = {
    found: boolean,
    info?: InfoBlock.AsObject,
    error: string,
  }
}

export class ContentDescriptor extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getRequired(): boolean;
  setRequired(value: boolean): void;

  getDeprecated(): boolean;
  setDeprecated(value: boolean): void;

  getSchemaJson(): string;
  setSchemaJson(value: string): void;

  getRefTarget(): string;
  setRefTarget(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContentDescriptor.AsObject;
  static toObject(includeInstance: boolean, msg: ContentDescriptor): ContentDescriptor.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContentDescriptor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContentDescriptor;
  static deserializeBinaryFromReader(message: ContentDescriptor, reader: jspb.BinaryReader): ContentDescriptor;
}

export namespace ContentDescriptor {
  export type AsObject = {
    name: string,
    summary: string,
    description: string,
    required: boolean,
    deprecated: boolean,
    schemaJson: string,
    refTarget: string,
  }
}

export class MethodSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearParamNamesList(): void;
  getParamNamesList(): Array<string>;
  setParamNamesList(value: Array<string>): void;
  addParamNames(value: string, index?: number): string;

  getResultName(): string;
  setResultName(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getDeprecated(): boolean;
  setDeprecated(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MethodSummary.AsObject;
  static toObject(includeInstance: boolean, msg: MethodSummary): MethodSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MethodSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MethodSummary;
  static deserializeBinaryFromReader(message: MethodSummary, reader: jspb.BinaryReader): MethodSummary;
}

export namespace MethodSummary {
  export type AsObject = {
    name: string,
    summary: string,
    description: string,
    paramNamesList: Array<string>,
    resultName: string,
    tagsList: Array<string>,
    deprecated: boolean,
  }
}

export class ListMethodsOutput extends jspb.Message {
  clearMethodsList(): void;
  getMethodsList(): Array<MethodSummary>;
  setMethodsList(value: Array<MethodSummary>): void;
  addMethods(value?: MethodSummary, index?: number): MethodSummary;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListMethodsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListMethodsOutput): ListMethodsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListMethodsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListMethodsOutput;
  static deserializeBinaryFromReader(message: ListMethodsOutput, reader: jspb.BinaryReader): ListMethodsOutput;
}

export namespace ListMethodsOutput {
  export type AsObject = {
    methodsList: Array<MethodSummary.AsObject>,
    error: string,
  }
}

export class ErrorObject extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getMessage(): string;
  setMessage(value: string): void;

  getDataSchemaJson(): string;
  setDataSchemaJson(value: string): void;

  getRefTarget(): string;
  setRefTarget(value: string): void;

  getComponentName(): string;
  setComponentName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorObject.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorObject): ErrorObject.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ErrorObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorObject;
  static deserializeBinaryFromReader(message: ErrorObject, reader: jspb.BinaryReader): ErrorObject;
}

export namespace ErrorObject {
  export type AsObject = {
    code: number,
    message: string,
    dataSchemaJson: string,
    refTarget: string,
    componentName: string,
  }
}

export class MethodErrors extends jspb.Message {
  getMethodName(): string;
  setMethodName(value: string): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ErrorObject>;
  setErrorsList(value: Array<ErrorObject>): void;
  addErrors(value?: ErrorObject, index?: number): ErrorObject;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MethodErrors.AsObject;
  static toObject(includeInstance: boolean, msg: MethodErrors): MethodErrors.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MethodErrors, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MethodErrors;
  static deserializeBinaryFromReader(message: MethodErrors, reader: jspb.BinaryReader): MethodErrors;
}

export namespace MethodErrors {
  export type AsObject = {
    methodName: string,
    errorsList: Array<ErrorObject.AsObject>,
  }
}

export class ExtractErrorsInput extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  getMethodName(): string;
  setMethodName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractErrorsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractErrorsInput): ExtractErrorsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractErrorsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractErrorsInput;
  static deserializeBinaryFromReader(message: ExtractErrorsInput, reader: jspb.BinaryReader): ExtractErrorsInput;
}

export namespace ExtractErrorsInput {
  export type AsObject = {
    document: string,
    methodName: string,
  }
}

export class ExtractErrorsOutput extends jspb.Message {
  clearGlobalErrorsList(): void;
  getGlobalErrorsList(): Array<ErrorObject>;
  setGlobalErrorsList(value: Array<ErrorObject>): void;
  addGlobalErrors(value?: ErrorObject, index?: number): ErrorObject;

  clearMethodErrorsList(): void;
  getMethodErrorsList(): Array<MethodErrors>;
  setMethodErrorsList(value: Array<MethodErrors>): void;
  addMethodErrors(value?: MethodErrors, index?: number): MethodErrors;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractErrorsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractErrorsOutput): ExtractErrorsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractErrorsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractErrorsOutput;
  static deserializeBinaryFromReader(message: ExtractErrorsOutput, reader: jspb.BinaryReader): ExtractErrorsOutput;
}

export namespace ExtractErrorsOutput {
  export type AsObject = {
    globalErrorsList: Array<ErrorObject.AsObject>,
    methodErrorsList: Array<MethodErrors.AsObject>,
    error: string,
  }
}

export class ServerVariable extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDefaultValue(): string;
  setDefaultValue(value: string): void;

  clearEnumValuesList(): void;
  getEnumValuesList(): Array<string>;
  setEnumValuesList(value: Array<string>): void;
  addEnumValues(value: string, index?: number): string;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerVariable.AsObject;
  static toObject(includeInstance: boolean, msg: ServerVariable): ServerVariable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerVariable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerVariable;
  static deserializeBinaryFromReader(message: ServerVariable, reader: jspb.BinaryReader): ServerVariable;
}

export namespace ServerVariable {
  export type AsObject = {
    name: string,
    defaultValue: string,
    enumValuesList: Array<string>,
    description: string,
  }
}

export class ServerInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getUrl(): string;
  setUrl(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearVariablesList(): void;
  getVariablesList(): Array<ServerVariable>;
  setVariablesList(value: Array<ServerVariable>): void;
  addVariables(value?: ServerVariable, index?: number): ServerVariable;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerInfo): ServerInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerInfo;
  static deserializeBinaryFromReader(message: ServerInfo, reader: jspb.BinaryReader): ServerInfo;
}

export namespace ServerInfo {
  export type AsObject = {
    name: string,
    url: string,
    summary: string,
    description: string,
    variablesList: Array<ServerVariable.AsObject>,
  }
}

export class ListServersOutput extends jspb.Message {
  clearServersList(): void;
  getServersList(): Array<ServerInfo>;
  setServersList(value: Array<ServerInfo>): void;
  addServers(value?: ServerInfo, index?: number): ServerInfo;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListServersOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListServersOutput): ListServersOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListServersOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListServersOutput;
  static deserializeBinaryFromReader(message: ListServersOutput, reader: jspb.BinaryReader): ListServersOutput;
}

export namespace ListServersOutput {
  export type AsObject = {
    serversList: Array<ServerInfo.AsObject>,
    error: string,
  }
}

export class ExtractComponentsOutput extends jspb.Message {
  clearSchemaNamesList(): void;
  getSchemaNamesList(): Array<string>;
  setSchemaNamesList(value: Array<string>): void;
  addSchemaNames(value: string, index?: number): string;

  clearContentDescriptorNamesList(): void;
  getContentDescriptorNamesList(): Array<string>;
  setContentDescriptorNamesList(value: Array<string>): void;
  addContentDescriptorNames(value: string, index?: number): string;

  clearErrorNamesList(): void;
  getErrorNamesList(): Array<string>;
  setErrorNamesList(value: Array<string>): void;
  addErrorNames(value: string, index?: number): string;

  clearExampleNamesList(): void;
  getExampleNamesList(): Array<string>;
  setExampleNamesList(value: Array<string>): void;
  addExampleNames(value: string, index?: number): string;

  clearExamplePairingNamesList(): void;
  getExamplePairingNamesList(): Array<string>;
  setExamplePairingNamesList(value: Array<string>): void;
  addExamplePairingNames(value: string, index?: number): string;

  clearLinkNamesList(): void;
  getLinkNamesList(): Array<string>;
  setLinkNamesList(value: Array<string>): void;
  addLinkNames(value: string, index?: number): string;

  clearTagNamesList(): void;
  getTagNamesList(): Array<string>;
  setTagNamesList(value: Array<string>): void;
  addTagNames(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractComponentsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractComponentsOutput): ExtractComponentsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractComponentsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractComponentsOutput;
  static deserializeBinaryFromReader(message: ExtractComponentsOutput, reader: jspb.BinaryReader): ExtractComponentsOutput;
}

export namespace ExtractComponentsOutput {
  export type AsObject = {
    schemaNamesList: Array<string>,
    contentDescriptorNamesList: Array<string>,
    errorNamesList: Array<string>,
    exampleNamesList: Array<string>,
    examplePairingNamesList: Array<string>,
    linkNamesList: Array<string>,
    tagNamesList: Array<string>,
    error: string,
  }
}

export class ExtractSchemaInput extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  getSchemaName(): string;
  setSchemaName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractSchemaInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractSchemaInput): ExtractSchemaInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractSchemaInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractSchemaInput;
  static deserializeBinaryFromReader(message: ExtractSchemaInput, reader: jspb.BinaryReader): ExtractSchemaInput;
}

export namespace ExtractSchemaInput {
  export type AsObject = {
    document: string,
    schemaName: string,
  }
}

export class ExtractSchemaOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getSchemaJson(): string;
  setSchemaJson(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractSchemaOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractSchemaOutput): ExtractSchemaOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractSchemaOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractSchemaOutput;
  static deserializeBinaryFromReader(message: ExtractSchemaOutput, reader: jspb.BinaryReader): ExtractSchemaOutput;
}

export namespace ExtractSchemaOutput {
  export type AsObject = {
    found: boolean,
    schemaJson: string,
    error: string,
  }
}

export class RefEntry extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getTarget(): string;
  setTarget(value: string): void;

  getIsInternal(): boolean;
  setIsInternal(value: boolean): void;

  getIsRemote(): boolean;
  setIsRemote(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RefEntry.AsObject;
  static toObject(includeInstance: boolean, msg: RefEntry): RefEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RefEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RefEntry;
  static deserializeBinaryFromReader(message: RefEntry, reader: jspb.BinaryReader): RefEntry;
}

export namespace RefEntry {
  export type AsObject = {
    path: string,
    target: string,
    isInternal: boolean,
    isRemote: boolean,
  }
}

export class ExtractRefsOutput extends jspb.Message {
  clearRefsList(): void;
  getRefsList(): Array<RefEntry>;
  setRefsList(value: Array<RefEntry>): void;
  addRefs(value?: RefEntry, index?: number): RefEntry;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRefsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRefsOutput): ExtractRefsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRefsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRefsOutput;
  static deserializeBinaryFromReader(message: ExtractRefsOutput, reader: jspb.BinaryReader): ExtractRefsOutput;
}

export namespace ExtractRefsOutput {
  export type AsObject = {
    refsList: Array<RefEntry.AsObject>,
    error: string,
  }
}

export class DereferenceInput extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  getMaxDepth(): number;
  setMaxDepth(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DereferenceInput.AsObject;
  static toObject(includeInstance: boolean, msg: DereferenceInput): DereferenceInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DereferenceInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DereferenceInput;
  static deserializeBinaryFromReader(message: DereferenceInput, reader: jspb.BinaryReader): DereferenceInput;
}

export namespace DereferenceInput {
  export type AsObject = {
    document: string,
    maxDepth: number,
  }
}

export class DereferenceOutput extends jspb.Message {
  getDocumentJson(): string;
  setDocumentJson(value: string): void;

  clearUnresolvedRemoteRefsList(): void;
  getUnresolvedRemoteRefsList(): Array<string>;
  setUnresolvedRemoteRefsList(value: Array<string>): void;
  addUnresolvedRemoteRefs(value: string, index?: number): string;

  clearCircularRefsList(): void;
  getCircularRefsList(): Array<string>;
  setCircularRefsList(value: Array<string>): void;
  addCircularRefs(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DereferenceOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DereferenceOutput): DereferenceOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DereferenceOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DereferenceOutput;
  static deserializeBinaryFromReader(message: DereferenceOutput, reader: jspb.BinaryReader): DereferenceOutput;
}

export namespace DereferenceOutput {
  export type AsObject = {
    documentJson: string,
    unresolvedRemoteRefsList: Array<string>,
    circularRefsList: Array<string>,
    error: string,
  }
}

export class TagGroup extends jspb.Message {
  getTagName(): string;
  setTagName(value: string): void;

  clearMethodNamesList(): void;
  getMethodNamesList(): Array<string>;
  setMethodNamesList(value: Array<string>): void;
  addMethodNames(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TagGroup.AsObject;
  static toObject(includeInstance: boolean, msg: TagGroup): TagGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TagGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TagGroup;
  static deserializeBinaryFromReader(message: TagGroup, reader: jspb.BinaryReader): TagGroup;
}

export namespace TagGroup {
  export type AsObject = {
    tagName: string,
    methodNamesList: Array<string>,
  }
}

export class GroupMethodsByTagOutput extends jspb.Message {
  clearGroupsList(): void;
  getGroupsList(): Array<TagGroup>;
  setGroupsList(value: Array<TagGroup>): void;
  addGroups(value?: TagGroup, index?: number): TagGroup;

  clearUntaggedMethodsList(): void;
  getUntaggedMethodsList(): Array<string>;
  setUntaggedMethodsList(value: Array<string>): void;
  addUntaggedMethods(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupMethodsByTagOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GroupMethodsByTagOutput): GroupMethodsByTagOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroupMethodsByTagOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupMethodsByTagOutput;
  static deserializeBinaryFromReader(message: GroupMethodsByTagOutput, reader: jspb.BinaryReader): GroupMethodsByTagOutput;
}

export namespace GroupMethodsByTagOutput {
  export type AsObject = {
    groupsList: Array<TagGroup.AsObject>,
    untaggedMethodsList: Array<string>,
    error: string,
  }
}

export class MethodNameInput extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  getMethodName(): string;
  setMethodName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MethodNameInput.AsObject;
  static toObject(includeInstance: boolean, msg: MethodNameInput): MethodNameInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MethodNameInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MethodNameInput;
  static deserializeBinaryFromReader(message: MethodNameInput, reader: jspb.BinaryReader): MethodNameInput;
}

export namespace MethodNameInput {
  export type AsObject = {
    document: string,
    methodName: string,
  }
}

export class MethodExample extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getParamsJson(): string;
  setParamsJson(value: string): void;

  getResultJson(): string;
  setResultJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MethodExample.AsObject;
  static toObject(includeInstance: boolean, msg: MethodExample): MethodExample.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MethodExample, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MethodExample;
  static deserializeBinaryFromReader(message: MethodExample, reader: jspb.BinaryReader): MethodExample;
}

export namespace MethodExample {
  export type AsObject = {
    name: string,
    description: string,
    paramsJson: string,
    resultJson: string,
  }
}

export class MethodDetail extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearParamsList(): void;
  getParamsList(): Array<ContentDescriptor>;
  setParamsList(value: Array<ContentDescriptor>): void;
  addParams(value?: ContentDescriptor, index?: number): ContentDescriptor;

  hasResult(): boolean;
  clearResult(): void;
  getResult(): ContentDescriptor | undefined;
  setResult(value?: ContentDescriptor): void;

  clearErrorsList(): void;
  getErrorsList(): Array<ErrorObject>;
  setErrorsList(value: Array<ErrorObject>): void;
  addErrors(value?: ErrorObject, index?: number): ErrorObject;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getDeprecated(): boolean;
  setDeprecated(value: boolean): void;

  getParamStructure(): string;
  setParamStructure(value: string): void;

  clearExamplesList(): void;
  getExamplesList(): Array<MethodExample>;
  setExamplesList(value: Array<MethodExample>): void;
  addExamples(value?: MethodExample, index?: number): MethodExample;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MethodDetail.AsObject;
  static toObject(includeInstance: boolean, msg: MethodDetail): MethodDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MethodDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MethodDetail;
  static deserializeBinaryFromReader(message: MethodDetail, reader: jspb.BinaryReader): MethodDetail;
}

export namespace MethodDetail {
  export type AsObject = {
    name: string,
    summary: string,
    description: string,
    paramsList: Array<ContentDescriptor.AsObject>,
    result?: ContentDescriptor.AsObject,
    errorsList: Array<ErrorObject.AsObject>,
    tagsList: Array<string>,
    deprecated: boolean,
    paramStructure: string,
    examplesList: Array<MethodExample.AsObject>,
  }
}

export class ExtractMethodOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  hasMethod(): boolean;
  clearMethod(): void;
  getMethod(): MethodDetail | undefined;
  setMethod(value?: MethodDetail): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMethodOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMethodOutput): ExtractMethodOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMethodOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMethodOutput;
  static deserializeBinaryFromReader(message: ExtractMethodOutput, reader: jspb.BinaryReader): ExtractMethodOutput;
}

export namespace ExtractMethodOutput {
  export type AsObject = {
    found: boolean,
    method?: MethodDetail.AsObject,
    error: string,
  }
}

export class ExtractMethodParamsOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  clearParamsList(): void;
  getParamsList(): Array<ContentDescriptor>;
  setParamsList(value: Array<ContentDescriptor>): void;
  addParams(value?: ContentDescriptor, index?: number): ContentDescriptor;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMethodParamsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMethodParamsOutput): ExtractMethodParamsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMethodParamsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMethodParamsOutput;
  static deserializeBinaryFromReader(message: ExtractMethodParamsOutput, reader: jspb.BinaryReader): ExtractMethodParamsOutput;
}

export namespace ExtractMethodParamsOutput {
  export type AsObject = {
    found: boolean,
    paramsList: Array<ContentDescriptor.AsObject>,
    error: string,
  }
}

export class ExtractMethodResultOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getHasResult(): boolean;
  setHasResult(value: boolean): void;

  hasResult(): boolean;
  clearResult(): void;
  getResult(): ContentDescriptor | undefined;
  setResult(value?: ContentDescriptor): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMethodResultOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMethodResultOutput): ExtractMethodResultOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMethodResultOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMethodResultOutput;
  static deserializeBinaryFromReader(message: ExtractMethodResultOutput, reader: jspb.BinaryReader): ExtractMethodResultOutput;
}

export namespace ExtractMethodResultOutput {
  export type AsObject = {
    found: boolean,
    hasResult: boolean,
    result?: ContentDescriptor.AsObject,
    error: string,
  }
}

export class DetectParamStructureOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getParamStructure(): string;
  setParamStructure(value: string): void;

  getExplicit(): boolean;
  setExplicit(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectParamStructureOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DetectParamStructureOutput): DetectParamStructureOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectParamStructureOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectParamStructureOutput;
  static deserializeBinaryFromReader(message: DetectParamStructureOutput, reader: jspb.BinaryReader): DetectParamStructureOutput;
}

export namespace DetectParamStructureOutput {
  export type AsObject = {
    found: boolean,
    paramStructure: string,
    explicit: boolean,
    error: string,
  }
}

export class CountSummaryOutput extends jspb.Message {
  getMethodCount(): number;
  setMethodCount(value: number): void;

  getSchemaCount(): number;
  setSchemaCount(value: number): void;

  getServerCount(): number;
  setServerCount(value: number): void;

  getTagCount(): number;
  setTagCount(value: number): void;

  getContentDescriptorCount(): number;
  setContentDescriptorCount(value: number): void;

  getErrorDefinitionCount(): number;
  setErrorDefinitionCount(value: number): void;

  getExampleCount(): number;
  setExampleCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountSummaryOutput.AsObject;
  static toObject(includeInstance: boolean, msg: CountSummaryOutput): CountSummaryOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountSummaryOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountSummaryOutput;
  static deserializeBinaryFromReader(message: CountSummaryOutput, reader: jspb.BinaryReader): CountSummaryOutput;
}

export namespace CountSummaryOutput {
  export type AsObject = {
    methodCount: number,
    schemaCount: number,
    serverCount: number,
    tagCount: number,
    contentDescriptorCount: number,
    errorDefinitionCount: number,
    exampleCount: number,
    error: string,
  }
}

