import { ethers } from 'ethers';
import { provider, getContract } from '../config/blockchain.js';
import { domain, types } from '../constants/eip712.js';

export const signAndIssueDocument = async payload => {
  const validator = process.env.VALIDATOR_PRIVATE_KEY;

  if (!validator) {
    throw new Error(`Validator private key not found in environment variables`);
  }

  const wallet = new ethers.Wallet(validator, provider);
  const contract = getContract(wallet);

  //  EIP-712 signing
  const signature = await wallet.signTypeData(domain, types, payload);

  //    TX
  const feeData = await provider.getFeeData();
  const tx = await contract.issueDocument(payload, signature);
};
