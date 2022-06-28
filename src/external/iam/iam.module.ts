import { Module } from '@nestjs/common';
import { IAMService } from './iam.service';

@Module({
  exports: [IAMService],
  providers: [IAMService],
})
export class IAMModule {}
