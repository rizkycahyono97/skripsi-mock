export const domain = {
  name: 'Tasdiqi-UNIDA',
  version: '1',
  chainId: parseInt(process.env.CHAIN_ID || '0'),
  verifyingContract: process.env.CONTRACT_ADDRESS
};

export const types = {
  Document: [
    { name: 'document_number', type: 'string' },
    { name: 'nim', type: 'string' },
    { name: 'doc_hash', type: 'bytes32' }
  ]
};
