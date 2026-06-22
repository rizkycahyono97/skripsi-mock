import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import {
  Contract,
  ContractTransactionResponse,
  JsonRpcProvider,
  Signer,
  TransactionReceipt,
  Wallet,
  ethers,
} from 'ethers';
import { domain, types } from './constant/eip712.constants';
import { SignDocumentRequest } from 'src/model/document.model';
import { BlockchainValidation } from './blockchain.validation';
import { ValidationService } from 'src/common/validation.service';
import { BlockchainReceiptResponse } from 'src/model/blockchain.model';
// import * as tasdiqiAbiJson from './TasdiqiABI.json';

@Injectable()
export class BlockchainService implements OnModuleInit {
  public provider!: JsonRpcProvider;
  private tasdiqiAbi!: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
  ) {}

  onModuleInit() {
    this.logger.info(
      '[BlockchainService.onModuleInit] inisialisasi konfigurasi blockchain',
    );

    const abiPath = path.join(process.cwd(), 'abi', 'TasdiqiABI.json');
    if (!fs.existsSync(abiPath)) {
      this.logger.error(
        `[BlockchainService.onModuleInit] File ABI Tasdiqi tidak ditemukan di route: ${abiPath}`,
      );
      throw new Error(`File ABI Tasdiqi tidak ditemukan di route: ${abiPath}`);
    }

    const abiJson = fs.readFileSync(abiPath, 'utf8');
    this.tasdiqiAbi = JSON.parse(abiJson).abi;

    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');
    const chainIdStr = this.configService.get<string>('BLOCKCHAIN_CHAIN_ID');

    if (!rpcUrl || !chainIdStr) {
      throw new Error(
        'BLOCKCHAIN_RPC_URL atau BLOCKCHAIN_CHAIN_ID belum didefinisikan di .env',
      );
    }

    this.provider = new ethers.JsonRpcProvider(
      rpcUrl,
      { chainId: parseInt(chainIdStr, 10), name: 'besu-local' },
      { staticNetwork: true },
    );
  }

  public getContract(signer: Signer): Contract {
    this.logger.info(
      `[BlockchainService.getContract] ${JSON.stringify(signer)}`,
    );
    const contractAddress = this.configService.get<string>(
      'BLOCKCHAIN_CONTRACT_ADDRESS',
    );
    if (!contractAddress) {
      this.logger.info(
        '[BlockchainService.getContract] BLOCKCHAIN_CONTRACT_ADDRESS tidak ditemukan di .env',
      );
      throw new Error('BLOCKCHAIN_CONTRACT_ADDRESS tidak ditemukan di .env');
    }

    return new ethers.Contract(contractAddress, this.tasdiqiAbi, signer);
  }

  async signAndIssueDocument(
    request: SignDocumentRequest,
  ): Promise<BlockchainReceiptResponse> {
    this.logger.info(
      `[BlockchainService.signAndIssueDocument] ${JSON.stringify(request)}`,
    );

    console.log(JSON.stringify(request));

    const blockchainRequest =
      this.validationService.validate<SignDocumentRequest>(
        BlockchainValidation.SIGN,
        request,
      );

    const validatorPk = blockchainRequest.validatorPrivateKey;
    if (!validatorPk) {
      throw new Error('Validator private key not found di  request API');
    }

    try {
      const wallet = new Wallet(validatorPk, this.provider);
      const contract = this.getContract(wallet);

      const signature: string = await wallet.signTypedData(
        domain,
        types,
        blockchainRequest,
      );
      this.logger.info(
        `[BlockchainService.signAndIssueDocument] Signature berhasil dibuat: ${signature}`,
      );

      const tx = (await contract.issueDocument(
        blockchainRequest,
        signature,
      )) as ContractTransactionResponse;

      this.logger.info(
        `[BlockchainService.signAndIssueDocument] Transaksi terkirim. Tx Hash: ${tx.hash}`,
      );

      const receipt = (await tx.wait()) as TransactionReceipt;
      const block = await this.provider.getBlock(receipt.blockNumber);

      this.logger.info(
        `[BlockchainService.signAndIssueDocument] Transaksi Sukses, Block #${receipt.blockNumber}! Gas Used: ${receipt.gasUsed.toString()}`,
      );

      // event contract
      const eventLog = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((parsed) => parsed?.name === 'DocumentIssued');

      if (!eventLog) {
        throw new Error('event DocumentIssued tidak ada');
      }

      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        contractAddress: String(receipt.to),
        documentKey: String(eventLog.args.documentKey),
        signerAddress: String(eventLog.args.signer),
        gasUsed: receipt.gasUsed.toString(),
        blockTimestamp: Number(block?.timestamp),
        status: receipt.status === 1 ? 'SUCCESS' : 'FAILED',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `[BlockchainService.signAndIssueDocument] Transaksi gagal: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }
}
