import { Module } from '@nestjs/common';
import { IAMModule } from 'external/iam/iam.module';
import { UserProfileController } from './user-profile.controller';
import { UserController } from './user.controller';

@Module({
  imports: [IAMModule],
  controllers: [UserController, UserProfileController],
})
export class UserModule {}
