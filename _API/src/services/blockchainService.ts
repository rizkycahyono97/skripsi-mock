import { ethers, Wallet } from 'ethers';
import { provider, getContract } from '../config/blockchain';
import { domain, types } from '../constants/eip712';
import { DocumentPayload } from '../types/services/document';
import { logger } from '../utils/logger';

export const signAndIssueDocument = async (
  payload: DocumentPayload
): Promise<any> => {
  const validator: string | undefined = process.env.VALIDATOR_PRIVATE_KEY;

  if (!validator) {
    throw new Error('Validator private key not found in environment variables');
  }

  logger.info(
    `[Blockchain Service][signAndIssueDocument] Begining: ${JSON.stringify(payload)}`
  );

  const wallet: Wallet = new ethers.Wallet(validator, provider);
  const contract = getContract(wallet);

  const signature: string = await wallet.signTypedData(domain, types, payload);
  logger.info(
    `[Blockchain Service][signAndIssueDocument] Signing: ${signature}`
  );

  const feeData = await provider.getFeeData();
  const tx = await contract.issueDocument(payload, signature);

  logger.info(
    `[Blockchain Service][signAndIssueDocument] Transaction Succesfully. Tx Hash: ${tx.hash}`
  );

  const receipt = await tx.wait();
  logger.info(
    `[Blockchain Service][signAndIssueDocument]] Transaction Succesfully, Block #${receipt.blockNumber}! Gas Used: ${receipt.gasUsed.toString()}`
  );

  return receipt;
};
