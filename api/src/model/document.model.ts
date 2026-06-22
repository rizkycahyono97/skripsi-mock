export class SignDocumentRequest {
  documentNumber!: string;
  identityHash!: string;
  fileHash!: string;
  validatorPrivateKey!: string;
}

export class SetValidatorDocumentRequest {
  validatorAddress!: string;
  status!: boolean;
}

export class CheckValidatorRequest {
  address!: string;
}
