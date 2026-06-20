export class BlockchainReceiptResponse {
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  status?: 'SUCCESS' | 'FAILED';
  from?: string;
  to?: string;
}
