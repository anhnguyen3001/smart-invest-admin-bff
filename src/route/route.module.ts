import { Module } from '@nestjs/common';
import { IAMModule } from 'external/iam/iam.module';
import { RouteController } from './route.controller';

@Module({
  imports: [IAMModule],
  controllers: [RouteController],
})
export class RouteModule {}
