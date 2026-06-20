export interface SignDocumentBody {
  nomor_surat: string;
  nim: string;
  document_hash: string;
}

export interface ValidationResponseData {
  tx_hash: string;
  block_number: number;
  gas_used: string;
  from: string;
  to: string;
  status: string;
}
