import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { Contract, JsonRpcProvider, Signer, Wallet, ethers } from 'ethers';
import { domain, types } from './constant/eip712.constants';
// import * as tasdiqiAbiJson from './TasdiqiABI.json';

interface DocumentPayload {
  documentNumber: string;
  identityHash: string;
  fileHash: string;
}

@Injectable()
export class BlockchainService implements OnModuleInit {
  public provider!: JsonRpcProvider;
  private tasdiqiAbi!: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  onModuleInit() {
    this.logger.info('blockchain.service[inisialisasi konfigurasi blockchain]');

    const abiPath = path.join(process.cwd(), 'abi', 'TasdiqiABI.json');
    if (!fs.existsSync(abiPath)) {
      this.logger.error(
        `File ABI Tasdiqi tidak ditemukan di route: ${abiPath}`,
      );
      throw new Error(`File ABI Tasdiqi tidak ditemukan di route: ${abiPath}`);
    }

    const abiJson = fs.readFileSync(abiPath, 'utf8');
    this.tasdiqiAbi = JSON.parse(abiJson).abi;

    const rpcUrl = this.configService.get<string>('RPC_URL');
    const chainIdStr = this.configService.get<string>('CHAIN_ID');

    if (!rpcUrl || !chainIdStr) {
      throw new Error('RPC_URL atau CHAIN_ID belum didefinisikan di .env');
    }

    this.provider = new ethers.JsonRpcProvider(
      rpcUrl,
      { chainId: parseInt(chainIdStr, 10), name: 'besu-local' },
      { staticNetwork: true },
    );
  }

  public getContract(signer: Signer): Contract {
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
    if (!contractAddress) {
      this.logger.info('CONTRACT_ADDRESS tidak ditemukan di .env');
      throw new Error('CONTRACT_ADDRESS tidak ditemukan di .env');
    }

    return new ethers.Contract(contractAddress, this.tasdiqiAbi, signer);
  }

  async signAndIssueDocument(payload: DocumentPayload): Promise<any> {
    const validatorPk = this.configService.get<string>('VALIDATOR_PRIVATE_KEY');

    if (!validatorPk) {
      throw new Error(
        'Validator private key not found di environment variables',
      );
    }

    this.logger.info(
      `[signAndIssueDocument] Memulai proses penandatanganan payload: ${JSON.stringify(payload)}`,
    );

    try {
      const wallet = new Wallet(validatorPk, this.provider);
      const contract = this.getContract(wallet);

      const signature: string = await wallet.signTypedData(
        domain,
        types,
        payload,
      );
      this.logger.info(
        `[signAndIssueDocument] Signature berhasil dibuat: ${signature}`,
      );

      this.logger.debug('Mengirim transaksi ke smart contract...');

      const tx = await contract.issueDocument(payload, signature);

      this.logger.info(
        `[signAndIssueDocument] Transaksi terkirim. Tx Hash: ${tx.hash}`,
      );

      const receipt = await tx.wait();

      this.logger.info(
        `[signAndIssueDocument] Transaksi Sukses, Block #${receipt.blockNumber}! Gas Used: ${receipt.gasUsed.toString()}`,
      );

      return receipt;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `[signAndIssueDocument] Transaksi gagal: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }
}
