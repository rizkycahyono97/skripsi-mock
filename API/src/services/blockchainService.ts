import { ethers, Wallet } from 'ethers';
import { provider, getContract } from '../config/blockchain';
import { domain, types } from '../constants/eip712';
import { DocumentPayload } from '../types/services/document';

export const signAndIssueDocument = async (
  payload: DocumentPayload
): Promise<any> => {
  const validator: string | undefined = process.env.VALIDATOR_PRIVATE_KEY;

  if (!validator) {
    throw new Error('Validator private key not found in environment variables');
  }

  const wallet: Wallet = new ethers.Wallet(validator, provider);
  const contract = getContract(wallet);

  const signature: string = await wallet.signTypedData(domain, types, payload);

  const feeData = await provider.getFeeData();
  const tx = await contract.issueDocument(payload, signature);
  const receipt = await tx.wait();

  return receipt;
};
