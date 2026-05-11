import * as bcService from '../services/blockchainService.js';

export const signDocument = async (req, res) => {
  const { nomor_surat, nim, document_hash, biro_slug } = req.body;

  try {
    const formattedHash = document_hash.startWith('0x')
      ? document_hash
      : `0x${document_hash}`;

    const payload = { nomor_surat, nim, doc_hash: formattedHash };

    const receipt = await bsService.signAndIssueDocument(biro_slug, payload);

    res.json({
      success: true,
      data: { tx_hash: receipt.hash, block: receipt.blockNumber }
    });
  } catch (error) {
    console.error('Error signing document:', error);
    res.status(500).json({ error: 'Failed to sign document' });
  }
};
