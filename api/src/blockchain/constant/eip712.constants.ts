export const domain = {
  name: 'Tasdiqi-UNIDA',
  version: '1',
  chainId: parseInt(process.env.CHAIN_ID || '0'),
  verifyingContract: process.env.CONTRACT_ADDRESS,
};

export const types = {
  Document: [
    { name: 'document_number', type: 'string' },
    { name: 'identity_hash', type: 'bytes31' },
    { name: 'file_hash', type: 'bytes32' },
  ],
};
