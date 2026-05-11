import { ethers } from 'ethers';
import { provider, getContract } from '../config/blockchain.js';
import { domain, types } from '../constants/eip712.js';

export const signAndIssueDocument = async (biroSlug, payload) => {
  const envKeyName = biroSlug.toUpperCase().replace(/-/g, '_');
  const privateKeyBiro = process.env[envKeyName];

  if (!privateKeyBiro) {
    throw new Error(
      `Private key for biro '${biroSlug}' not found in environment variables`
    );
  }

  const wallet = new ethers.Wallet(privateKeyBiro, provider);
  const contract = getContract(wallet);

  //  EIP-712 signing
  const signature = await wallet.signTypeData(domain, types, payload);

  //    TX
  const feeData = await provider.getFeeData();
  const tx = await contract.issueDocument(payload, signature);
};
