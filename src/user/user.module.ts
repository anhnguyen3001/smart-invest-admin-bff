import { Module } from '@nestjs/common';
import { IAMModule } from 'external/iam/iam.module';
import { UserController } from './user.controller';

@Module({
  imports: [IAMModule],
  controllers: [UserController],
})
export class UserModule {}
