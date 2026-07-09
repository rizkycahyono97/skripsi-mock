import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { BlockchainService } from '../src/blockchain/blockchain.service';
import { DocumentController } from '../src/document/document.controller';

describe('DocumentController (unit)', () => {
  let app: INestApplication<App>;

  // mock biar gak make service asli
  const mockBlockchainService = {
    getDocumentDetail: jest.fn(),
    signAndIssueDocument: jest.fn(),
    setValidatorStatus: jest.fn(),
    isAuthorizedValidator: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('GET /api/documents/:documentKey', () => {
    const documentKey =
      '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890';

    it('harus mengembalikan detail dokumen', async () => {
      const documentDetail = {
        documentNumber: 'DOC-2026-001',
        identityHash:
          '0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890',
        fileHash:
          '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        registeredAt: 1752048000,
      };

      mockBlockchainService.getDocumentDetail.mockResolvedValue(documentDetail);

      const response = await request(app.getHttpServer())
        .get(`/api/documents/${documentKey}`)
        .expect(200);

      expect(response.body).toEqual({ data: documentDetail });
      expect(mockBlockchainService.getDocumentDetail).toHaveBeenCalledWith({
        documentKey,
      });
    });

    it('harus meneruskan error dari service', async () => {
      mockBlockchainService.getDocumentDetail.mockRejectedValue(
        new Error('Dokumen tidak ditemukan'),
      );

      await request(app.getHttpServer())
        .get(`/api/documents/${documentKey}`)
        .expect(500);
    });
  });

  describe('POST /api/documents/sign', () => {
    const signRequest = {
      documentNumber: 'DOC-2026-001',
      identityHash:
        '0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890',
      fileHash:
        '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      validatorPrivateKey:
        'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
    };

    it('harus menandatangani dan menerbitkan dokumen', async () => {
      const receipt = {
        transactionHash:
          '0x3f5c8e9a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12',
        blockNumber: 42,
        blockHash:
          '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        documentKey:
          '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
        signerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        gasUsed: '210000',
        blockTimestamp: 1752048000,
        status: 'SUCCESS' as const,
      };

      mockBlockchainService.signAndIssueDocument.mockResolvedValue(receipt);

      const response = await request(app.getHttpServer())
        .post('/api/documents/sign')
        .send(signRequest)
        .expect(200);

      expect(response.body).toEqual({ data: receipt });
      expect(mockBlockchainService.signAndIssueDocument).toHaveBeenCalledWith(
        signRequest,
      );
    });

    it('harus meneruskan error dari service', async () => {
      mockBlockchainService.signAndIssueDocument.mockRejectedValue(
        new Error('Transaksi gagal'),
      );

      await request(app.getHttpServer())
        .post('/api/documents/sign')
        .send(signRequest)
        .expect(500);
    });
  });

  describe('POST /api/documents/validator', () => {
    it('harus mengaktifkan validator', async () => {
      const validatorRequest = {
        validatorAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        status: true,
      };

      const validatorResponse = {
        transactionHash:
          '0x9a8b7c6d5e4f3210987654321098765432109876543210987654321098765432',
        status: 'SUCCESS' as const,
      };

      mockBlockchainService.setValidatorStatus.mockResolvedValue(
        validatorResponse,
      );

      const response = await request(app.getHttpServer())
        .post('/api/documents/validator')
        .send(validatorRequest)
        .expect(200);

      expect(response.body).toEqual({ data: validatorResponse });
      expect(mockBlockchainService.setValidatorStatus).toHaveBeenCalledWith(
        validatorRequest,
      );
    });

    it('harus menonaktifkan validator', async () => {
      const validatorRequest = {
        validatorAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        status: false,
      };

      const validatorResponse = {
        transactionHash:
          '0x9a8b7c6d5e4f3210987654321098765432109876543210987654321098765432',
        status: 'SUCCESS' as const,
      };

      mockBlockchainService.setValidatorStatus.mockResolvedValue(
        validatorResponse,
      );

      const response = await request(app.getHttpServer())
        .post('/api/documents/validator')
        .send(validatorRequest)
        .expect(200);

      expect(response.body).toEqual({ data: validatorResponse });
      expect(mockBlockchainService.setValidatorStatus).toHaveBeenCalledWith(
        validatorRequest,
      );
    });

    it('harus meneruskan error dari service', async () => {
      mockBlockchainService.setValidatorStatus.mockRejectedValue(
        new Error('Owner private key tidak ditemukan'),
      );

      await request(app.getHttpServer())
        .post('/api/documents/validator')
        .send({
          validatorAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          status: true,
        })
        .expect(500);
    });
  });

  describe('GET /api/documents/validator/check/:address', () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

    it('harus mengembalikan validator yang terotorisasi', async () => {
      const validatorStatus = {
        address,
        isAuthorized: true,
      };

      mockBlockchainService.isAuthorizedValidator.mockResolvedValue(
        validatorStatus,
      );

      const response = await request(app.getHttpServer())
        .get(`/api/documents/validator/check/${address}`)
        .expect(200);

      expect(response.body).toEqual({ data: validatorStatus });
      expect(mockBlockchainService.isAuthorizedValidator).toHaveBeenCalledWith({
        address,
      });
    });

    it('harus mengembalikan validator yang tidak terotorisasi', async () => {
      const validatorStatus = {
        address,
        isAuthorized: false,
      };

      mockBlockchainService.isAuthorizedValidator.mockResolvedValue(
        validatorStatus,
      );

      const response = await request(app.getHttpServer())
        .get(`/api/documents/validator/check/${address}`)
        .expect(200);

      expect(response.body).toEqual({ data: validatorStatus });
      expect(mockBlockchainService.isAuthorizedValidator).toHaveBeenCalledWith({
        address,
      });
    });

    it('harus meneruskan error dari service', async () => {
      mockBlockchainService.isAuthorizedValidator.mockRejectedValue(
        new Error('Gagal menghubungi contract'),
      );

      await request(app.getHttpServer())
        .get(`/api/documents/validator/check/${address}`)
        .expect(500);
    });
  });
});
