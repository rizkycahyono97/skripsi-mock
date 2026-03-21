require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import tasdiqiAbi from './TasdiqiABI.json';

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tasdiqiContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  tasdiqiAbi,
  signer
);

// domain EIP-712
const domain = {
  name: 'Tasdiqi',
  version: '1',
  chainId: process.env.CHAIN_ID,
  verifyingContract: process.env.CONTRACT_ADDRESS
};

// types EIP-712
const types = {
  Document: [
    { name: 'nomor_surat', type: 'string' },
    { name: 'nim', type: 'string' },
    { name: 'doc_hash', type: 'bytes32' }
  ]
};

app.post('/api/sign-document', async (req, res) => {
  try {
    const { nomor_surat, nim, document_hash } = req.body;

    if (!nomor_surat || !nim || !document_hash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const value = {
      nomor_surat: nomor_surat,
      nim: nim,
      doc_hash: document_hash
    };

    //signing EIP-712
    const signature = await signer.signTypedData(domain, types, value);
    console.log('Signature berhasil dibuat:: ', signature);

    // kirim ke contract
    const tx = await tasdiqiAbi.issueDocument(value, signature);
    console.log('Menunggu transaksi selesai....');
    const receipt = await tx.await();

    //response
    return res.json({
      success: true,
      message: 'Document berhasil ditandatangani dan disimpan di blockchain',
      tx_hash: receipt.hash,
      signer: signer.address
    });
  } catch (e) {
    console.error('Error signing document:', e);
    return res.status(500).json({
      success: false,
      message: e.reason || 'Terjadi kesalahan pada server API',
      error: e.message
    });
  }
});
