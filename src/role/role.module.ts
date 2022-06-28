import { Module } from '@nestjs/common';
import { IAMModule } from 'external/iam/iam.module';
import { RoleController } from './role.controller';

@Module({
  imports: [IAMModule],
  controllers: [RoleController],
})
export class RoleModule {}
