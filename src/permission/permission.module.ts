import { Module } from '@nestjs/common';
import { IAMModule } from 'external/iam/iam.module';
import { PermissionController } from './permission.controller';

@Module({
  imports: [IAMModule],
  controllers: [PermissionController],
})
export class PermissionModule {}
