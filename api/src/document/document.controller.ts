import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import {
  BlockchainReceiptResponse,
  BlockchainValidatorResponse,
} from 'src/model/blockchain.model';
import {
  SetValidatorDocumentRequest,
  SignDocumentRequest,
} from 'src/model/document.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/documents')
export class DocumentController {
  constructor(private blockchainService: BlockchainService) {}

  @Post('/sign')
  @HttpCode(200)
  async sign(
    @Body() request: SignDocumentRequest,
  ): Promise<WebResponse<BlockchainReceiptResponse>> {
    const result = await this.blockchainService.signAndIssueDocument(request);

    return {
      data: result,
    };
  }

  @Post('/set-validator')
  @HttpCode(200)
  async setValidator(
    @Body() request: SetValidatorDocumentRequest,
  ): Promise<WebResponse<BlockchainValidatorResponse>> {
    const result = await this.blockchainService.setValidatorStatus(request);

    return {
      data: result,
    };
  }
}
