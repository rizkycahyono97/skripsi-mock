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
  const startTime = Date.now();

  try {
    let { nomor_surat, nim, document_hash, biro_slug } = req.body;

    console.log(
      '\n================= [SIGN DOCUMENT REQUEST] ================='
    );
    console.log('Request Body:', {
      nomor_surat,
      nim,
      document_hash,
      biro_slug
    });

    if (!nomor_surat || !nim || !document_hash || !biro_slug) {
      console.log('[ERROR] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const envKeyName = biro_slug.toUpperCase().replace(/-/g, '_');
    const privateKeyBiro = process.env[envKeyName];

    if (!privateKeyBiro) {
      console.log(
        `[ERROR] Private key tidak ditemukan untuk biro: ${biro_slug}`
      );
      return res.status(400).json({
        error: `Private key for biro '${biro_slug}' not found in environment variables`
      });
    }

    // signer secara dinamis
    const currentSigner = new ethers.Wallet(privateKeyBiro, provider);
    const contractWithSigner = tasdiqiContract.connect(currentSigner);

    console.log('\n[STEP 1] SIGNER INFO');
    console.log('Address:', currentSigner.address);
    console.log('Biro   :', biro_slug);

    if (document_hash && !document_hash.startsWith('0x')) {
      document_hash = '0x' + document_hash;
    }

    const value = {
      nomor_surat: nomor_surat,
      nim: nim,
      doc_hash: document_hash
    };

    console.log('\n[STEP 2] EIP-712 DATA');
    console.log('Domain:', domain);
    console.log('Types :', types);
    console.log('Value :', value);

    //signing EIP-712
    const signature = await currentSigner.signTypedData(domain, types, value);

    console.log('\n[STEP 3] SIGNATURE CREATED');
    console.log('Signature:', signature);

    const feeData = await provider.getFeeData();
    const nonce = await provider.getTransactionCount(
      currentSigner.address,
      'pending'
    );

    console.log('\n[STEP 4] TRANSACTION PREPARATION');
    console.log('Nonce               :', nonce);
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      console.log('Mode              : EIP-1559');
      console.log('Max Fee Per Gas   :', feeData.maxFeePerGas.toString());
      console.log(
        'Max Priority Fee  :',
        feeData.maxPriorityFeePerGas.toString()
      );
    } else {
      console.log('Mode              : LEGACY');
      console.log('Gas Price         :', feeData.gasPrice?.toString() || '0');
    }

    // kirim ke contract
    console.log('\n[STEP 5] SENDING TRANSACTION...');
    const tx = await contractWithSigner.issueDocument(value, signature, {
      gasLimit: 500000,
      maxFeePerGas: feeData.maxFeePerGas || 0,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 0
    });

    console.log('Tx Hash (pending):', tx.hash);

    const receipt = await tx.wait();

    console.log('\n[STEP 6] TRANSACTION CONFIRMED');
    console.log('Status       :', receipt.status === 1 ? 'SUCCESS' : 'FAILED');
    console.log('Block Number :', receipt.blockNumber);
    console.log('Gas Used     :', receipt.gasUsed.toString());
    console.log('From         :', receipt.from);
    console.log('To           :', receipt.to);

    const duration = Date.now() - startTime;

    console.log('\n[COMPLETED]');
    console.log('Execution Time:', duration + ' ms');
    console.log(
      '===========================================================\n'
    );

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
        execution_time_ms: duration,
        timestamp: new Date().toISOString()
      }
    });
  } catch (e) {
    console.error('\n[ERROR SIGN DOCUMENT]');
    console.error('Message:', e.message);
    console.error('Reason :', e.reason);
    console.error('Code   :', e.code);
    console.error('Stack  :', e.stack);
    console.error(
      '===========================================================\n'
    );

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
