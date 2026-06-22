import { SignDocumentRequest } from 'src/model/document.model';
import { z, ZodType } from 'zod';

export class BlockchainValidation {
  static readonly SIGN: ZodType<SignDocumentRequest> = z.object({
    documentNumber: z
      .string()
      .min(1, { message: 'Nomor dokumen tidak boleh kosong' }),

    identityHash: z
      .string()
      .min(1, { message: 'Identity Hash tidak boleh kosong' }),

    fileHash: z.string().min(1, { message: 'File Hash tidak boleh kosong' }),

    validatorPrivateKey: z
      .string()
      .min(64, 'Private key terlalu pendek')
      .max(64, 'private key terlalu panjang'),
  });
}
