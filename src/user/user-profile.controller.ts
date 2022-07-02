import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { DetailUserDto, UserProfileResponseDto } from './user.dto';

@ApiBearerAuth()
@ApiTags('UserProfile')
@Controller({
  path: 'me',
  version: configService.getValue('API_VERSION'),
})
export class UserProfileController {
  @Get()
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(UserProfileResponseDto, {
    description: 'Get user info successfully',
  })
  async getUserInfo(
    @GetUser() user: DetailUserDto,
  ): Promise<BaseResponse<UserProfileResponseDto>> {
    return getBaseResponse(
      {
        data: { user },
      },
      UserProfileResponseDto,
    );
  }
}
