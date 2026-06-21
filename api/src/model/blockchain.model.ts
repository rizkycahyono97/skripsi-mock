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
