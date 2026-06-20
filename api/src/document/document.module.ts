import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { BlockchainModule } from 'src/blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [DocumentController],
})
export class DocumentModule {}
