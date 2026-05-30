import { Request, Response } from 'express';
import * as bcService from '../services/blockchainService';
import {
  SignDocumentBody,
  ValidationResponseData
} from '../types/controllers/document';
import { sendError, sendSuccess } from '../utils/responseFormatter';

export const signDocument = async (
  req: Request<any, any, SignDocumentBody>,
  res: Response
): Promise<void> => {
  const { nomor_surat, nim, document_hash } = req.body;

  if (!nomor_surat || !nim || !document_hash) {
    sendError(
      res,
      'Gagal memproses validasi dokumen',
      'Missing required field body',
      'VALIDATION_ERROR',
      400
    );
    return;
  }

  try {
    const formattedHash: string = document_hash.startsWith('0x')
      ? document_hash
      : `0x${document_hash}`;

    const payload = { nomor_surat, nim, doc_hash: formattedHash };

    const receipt = await bcService.signAndIssueDocument(payload);

    const responseData: ValidationResponseData = {
      tx_hash: receipt.hash,
      block_number: receipt.blockNumber,
      gas_used: receipt.gasUsed.toString(),
      from: receipt.from,
      to: receipt.to,
      status: receipt.status === 1 ? 'Success' : 'Failed'
    };

    sendSuccess(
      res,
      'Dokumen berhasil divalidasi oleh Arsip dan dimasukan ke Blockchain',
      responseData,
      201
    );
  } catch (error: any) {
    console.error('\n[ERROR VALIDATION CONTROLLER]:', error);

    // error diambil dari blockchain
    if (
      error.message?.includes('already registered') ||
      error.reason?.includes('terdaftar')
    ) {
      sendError(
        res,
        'Gagal Memasukan dokumen ke Blockchain',
        'Sidik jari dokumen (hash) ini sudah tervalidasi sebelumnya di blockchain',
        'DOCUMENT_ALREADY_EXISTS',
        409
      );
      return;
    }

    sendError(
      res,
      'Gagal memproses transaksi ke Blockchain Besu',
      error.reason || error.message,
      error.code || 'BLOCKCHAIN_TRANSACTION_FAILED',
      500
    );
  }
};
