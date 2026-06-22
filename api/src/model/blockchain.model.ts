import { string } from 'zod';

export class BlockchainReceiptResponse {
  transactionHash!: string;
  blockNumber!: number;
  blockHash!: string;
  contractAddress!: string;
  documentKey!: string;
  signerAddress!: string;
  gasUsed!: string;
  blockTimestamp!: number;
  status!: 'SUCCESS' | 'FAILED';
}

export class BlockchainValidatorResponse {
  transactionHash!: string;
  status!: 'SUCCESS' | 'FAILED';
}

export class BlockchainIsValidatorResponse {
  address!: string;
  isAuthorized!: boolean;
}

export class GetDocumentDetailResponse {
  documentNumber!: string;
  identityHash!: string;
  fileHash!: string;
  signer!: string;
  registeredAt!: number;
}
