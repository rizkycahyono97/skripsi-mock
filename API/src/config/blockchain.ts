import 'dotenv/config';
import { ethers, Contract, JsonRpcProvider, Signer } from 'ethers';
import fs from 'fs';

const abiPath: string = './TasdiqiABI.json';
if (!fs.existsSync(abiPath)) {
  throw new Error(`File ABI tidak ditemukan di ${abiPath}`);
}

const tasdiqiAbi = JSON.parse(fs.readFileSync(abiPath, 'utf-8')).abi;

const chainId: number | null = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : null;

if (!process.env.RPC_URL || !chainId) {
  throw new Error('RPC_URL atau CHAIN_ID belum didefinisikan di .env');
}

export const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
  process.env.RPC_URL,
  {
    chainId: chainId,
    name: 'besu-local'
  },
  { staticNetwork: true }
);

export const getContract = (signer: Signer): Contract => {
  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS belum didefinisikan di .env');
  }
  return new ethers.Contract(process.env.CONTRACT_ADDRESS, tasdiqiAbi, signer);
};
