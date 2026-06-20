import { SignDocumentRequest } from 'src/model/document.model';
import { z, ZodType } from 'zod';

export class BlockchainValidation {
  static readonly SIGN: ZodType<SignDocumentRequest> = z.object({
    document_number: z
      .string()
      .min(1, { message: 'Nomor dokumen tidak boleh kosong' }),

    identity_hash: z
      .string()
      .min(1, { message: 'Identity Hash tidak boleh kosong' }),
    // .startsWith('0x', { message: 'Identity Hash harus diawali dengan 0x' }),

    file_hash: z.string().min(1, { message: 'File Hash tidak boleh kosong' }),
    // .startsWith('0x', { message: 'File Hash harus diawali dengan 0x' }),
  });
}
