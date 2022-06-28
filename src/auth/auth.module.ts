import { Module } from '@nestjs/common';
import { IAMModule } from 'external/iam/iam.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [IAMModule],
  controllers: [AuthController],
})
export class AuthModule {}
