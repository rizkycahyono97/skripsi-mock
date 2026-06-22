import {
  SignDocumentRequest,
  SetValidatorDocumentRequest,
} from 'src/model/document.model';
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

  static readonly VALIDATOR: ZodType<SetValidatorDocumentRequest> = z.object({
    validatorAddress: z
      .string()
      .regex(/^(0x)?[0-9a-fA-F]{40}$/, 'Format Ethereum Address tidak valid'),
    status: z.boolean({
      error: 'Status wajib boolean (true / false)',
    }),
  });
}
