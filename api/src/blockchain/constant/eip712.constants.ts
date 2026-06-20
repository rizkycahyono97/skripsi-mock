export const domain = {
  name: 'Tasdiqi-UNIDA',
  version: '1',
  chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '0'),
  verifyingContract: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
};

export const types = {
  Document: [
    { name: 'document_number', type: 'string' },
    { name: 'identity_hash', type: 'bytes32' },
    { name: 'file_hash', type: 'bytes32' },
  ],
};
