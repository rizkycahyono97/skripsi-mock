import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import {
  Contract,
  ContractRunner,
  ContractTransactionResponse,
  JsonRpcProvider,
  TransactionReceipt,
  Wallet,
  ethers,
} from 'ethers';
import { domain, types } from './constant/eip712.constants';
import {
  CheckValidatorRequest,
  GetDocumentDetailRequest,
  SetValidatorDocumentRequest,
  SignDocumentRequest,
} from 'src/model/document.model';
import { BlockchainValidation } from './blockchain.validation';
import { ValidationService } from 'src/common/validation.service';
import {
  BlockchainIsValidatorResponse,
  BlockchainReceiptResponse,
  BlockchainValidatorResponse,
  GetDocumentDetailResponse,
} from 'src/model/blockchain.model';
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
      `[BlockchainService.onModuleInit] inisialisasi konfigurasi blockchain`,
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

  async signAndIssueDocument(
    request: SignDocumentRequest,
  ): Promise<BlockchainReceiptResponse> {
    this.logger.info(
      `[BlockchainService.signAndIssueDocument] ${JSON.stringify(request)}`,
    );

    // console.log(JSON.stringify(request));

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
      const contract = await this.getContract(wallet);
      const contractAddress = await contract.getAddress();

      await this.validateContractDeployment(contractAddress);

      console.dir(
        { domain, types, message: blockchainRequest },
        { depth: null, colors: true },
      );

      // PROSES EIP-712
      const signature: string = await wallet.signTypedData(
        domain,
        types,
        blockchainRequest,
      );
      this.logger.info(
        `[BlockchainService.signAndIssueDocument] Signature berhasil dibuat: ${JSON.stringify(signature)}`,
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

      const eventLog = this.parseAndValidateEvent(
        receipt,
        contract,
        contractAddress,
        'DocumentIssued',
      );

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

  async setValidatorStatus(
    request: SetValidatorDocumentRequest,
  ): Promise<BlockchainValidatorResponse> {
    this.logger.info(
      `[BlockchainService.setValidatorStatus] ${JSON.stringify(request)}`,
    );

    const ownerPk = this.configService.get<string>(
      'BLOCKCHAIN_OWNER_PRIVATE_KEY',
    );
    if (!ownerPk) {
      throw new Error(
        'Owner private key tidak ditemukan di environment variables',
      );
    }

    try {
      const ownerWallet = new Wallet(ownerPk, this.provider);
      const contract = await this.getContract(ownerWallet);

      const tx = (await contract.setValidator(
        request.validatorAddress,
        request.status,
      )) as ContractTransactionResponse;
      this.logger.info(
        `[BlockchainService.setValidatorStatus] Tx Terkirim: ${tx.hash}`,
      );

      const receipt = (await tx.wait()) as TransactionReceipt;

      return {
        transactionHash: receipt.hash,
        status: receipt.status === 1 ? 'SUCCESS' : 'FAILED',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `[BlockchainService.setValidatorStatus] Gagal: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  async isAuthorizedValidator(
    request: CheckValidatorRequest,
  ): Promise<BlockchainIsValidatorResponse> {
    this.logger.info(
      `[BlockchainService.isAuthorizedValidator] ${JSON.stringify(request)}`,
    );

    try {
      const contract = await this.getContract(this.provider);

      const isAuthorized: boolean = await contract.isAuthorizedValidator(
        request.address,
      );

      this.logger.info(
        `[BlockchainService.isAuthorizedValidator] ${request.address}-${isAuthorized ? 'AKTIF' : 'TIDAK AKTIF'}`,
      );

      return {
        address: request.address,
        isAuthorized: isAuthorized,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `[BlockchainService.isAuthorizedValidator] ${err.message}-${err.stack} `,
      );
      throw error;
    }
  }

  async getDocumentDetail(
    request: GetDocumentDetailRequest,
  ): Promise<GetDocumentDetailResponse> {
    this.logger.info(
      `[BlockchainService.getDocumentDetail] ${JSON.stringify(request)}`,
    );

    try {
      const contract = await this.getContract(this.provider);
      const document: GetDocumentDetailResponse = await contract.getDocument(
        request.documentKey,
      );

      this.logger.info(
        `[BlockchainService.getDocumentDetail] ${request.documentKey}  berhasil didapatkan`,
      );

      return {
        documentNumber: document.documentNumber,
        identityHash: document.identityHash,
        fileHash: document.fileHash,
        signer: document.signer,
        registeredAt: Number(document.registeredAt),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `[BlockchainService.getDocumentDetail] ${err.message}-${err.stack} `,
      );
      throw error;
    }
  }

  private async getContract(runner: ContractRunner): Promise<Contract> {
    this.logger.info(
      `[BlockchainService.getContract] ${JSON.stringify(runner)}`,
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

    //jika contract belum terdeploy
    await this.validateContractDeployment(contractAddress);

    return new Contract(contractAddress, this.tasdiqiAbi, runner);
  }

  /**
   * @param contractAddress
   * memastikan contract ada di jaringan blockchain
   */
  private async validateContractDeployment(
    contractAddress: string,
  ): Promise<void> {
    const byteCode = await this.provider.getCode(contractAddress);

    if (byteCode === '0x' || byteCode === '0x00') {
      throw new Error(
        `Contract ${contractAddress} belum terdeploy, Pastikan contract di deploy di jaringan Blockchain`,
      );
    }
  }

  private parseAndValidateEvent(
    receipt: TransactionReceipt,
    contract: Contract,
    contractAddress: string,
    eventName: string,
  ): any {
    const hasLogsFromContract = receipt.logs.some(
      (log) => log.address.toLowerCase() === contractAddress.toLowerCase(),
    );

    if (!hasLogsFromContract) {
      throw new Error(
        'Transaksi sukses, tetapi Contract tidak mengeluarkan log/event sama sekali.',
      );
    }

    const parseLogs = receipt.logs.map((log) => {
      try {
        return contract.interface.parseLog(log);
      } catch (err) {
        this.logger.warn(
          `[BlockchainService] Gagal parsing log: ${(err as Error).message}`,
        );
        return null;
      }
    });

    const eventLog = parseLogs.find((parsed) => parsed?.name === eventName);

    if (!eventLog) {
      throw new Error(
        'Event DocumentIssued tidak ditemukan setelah parsing. Periksa apakah ABI di backend sudah sesuai dengan yang ada di Blockchain!',
      );
    }

    return eventLog;
  }
}
