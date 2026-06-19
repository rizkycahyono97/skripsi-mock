import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DocumentModule } from './document/document.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [CommonModule, DocumentModule, BlockchainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
