import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import fs from 'fs';
import { env } from 'process';

const tasdiqiAbi = JSON.parse(
  fs.readFileSync('./TasdiqiABI.json', 'utf-8')
).abi;

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL,
  {
    chainId: parseInt(process.env.CHAIN_ID),
    name: 'besu'
  },
  { staticNetwork: true }
);
provider.pollingInterval = 500;
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tasdiqiContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  tasdiqiAbi,
  signer
);

// domain EIP-712
const domain = {
  name: 'Tasdiqi-UNIDA',
  version: '1',
  chainId: parseInt(process.env.CHAIN_ID),
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

app.get('/healthy', (req, res) => {
  res.send('API Tasdiqi is running');
});

app.post('/api/sign-document', async (req, res) => {
  try {
    let { nomor_surat, nim, document_hash, biro_slug } = req.body;

    if (!nomor_surat || !nim || !document_hash || !biro_slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const envKeyName = biro_slug.toUpperCase().replace(/-/g, '_');
    const privateKeyBiro = process.env[envKeyName];

    if (!privateKeyBiro) {
      return res.status(400).json({
        error: `Private key for biro '${biro_slug}' not found in environment variables`
      });
    }

    // signer secara dinamis
    const currentSigner = new ethers.Wallet(privateKeyBiro, provider);
    const contractWithSigner = tasdiqiContract.connect(currentSigner);
    console.log(`Menggunakan signer: ${biro_slug} (${currentSigner.address})`);

    if (document_hash && !document_hash.startsWith('0x')) {
      document_hash = '0x' + document_hash;
    }

    const value = {
      nomor_surat: nomor_surat,
      nim: nim,
      doc_hash: document_hash
    };

    //signing EIP-712
    const signature = await currentSigner.signTypedData(domain, types, value);
    console.log('Signature berhasil dibuat:: ', signature);

    const feeData = await provider.getFeeData();
    console.log('Fee Data:', feeData);

    const nonce = await provider.getTransactionCount(
      currentSigner.address,
      'pending'
    );

    // kirim ke contract
    console.log('Mengirim transaksi ke blockchain...');
    const tx = await contractWithSigner.issueDocument(value, signature, {
      gasLimit: 500000,
      maxFeePerGas: feeData.maxFeePerGas || 0,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 0
    });
    console.log('Nonce:', nonce);
    console.log('value: ', value);
    console.log('Signature: ', signature);
    console.log('Menunggu transaksi selesai....');

    const receipt = await tx.wait();
    if (receipt) {
      console.log(` Transaksi Berhasil!`);
      console.log(`   Block Number : ${receipt.blockNumber}`);
      console.log(`   Tx Hash      : ${receipt.hash}`);
      console.log(`   Gas Used     : ${receipt.gasUsed.toString()}`);
    }

    //response
    return res.json({
      success: true,
      message: 'Document berhasil ditandatangani dan disimpan di blockchain',
      data: {
        tx_hash: receipt.hash,
        block_number: receipt.blockNumber,
        gas_used: receipt.gasUsed.toString(),
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1 ? 'Success' : 'Failed',
        signer_address: currentSigner.address,
        timestamp: new Date().toISOString()
      }
    });
  } catch (e) {
    console.error('Error signing document:', e);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses transaksi ke Blockchain',
      error_detail: e.reason || e.message,
      code: e.code || 'UNKNOWN_ERROR'
    });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(` API Tasdiqi berjalan di http://localhost:${PORT}`);
  console.log(` Terhubung ke RPC: ${process.env.RPC_URL}`);
});
