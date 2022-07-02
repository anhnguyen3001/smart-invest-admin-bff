import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiIdParam } from 'common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { Identity, RequestParamId } from 'common/dto';
import {
  BaseResponse,
  IAMApiResponseInterface,
} from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { IAMService } from 'external/iam/iam.service';
import { SearchUserDto, SearchUsersResponse, UpdateUserDto } from './user.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  path: 'users',
  version: configService.getValue('API_VERSION'),
})
export class UserController {
  constructor(private readonly iamService: IAMService) {}

  @Get()
  @ApiOperation({
    summary: 'Get users by queries',
  })
  @ApiOkBaseResponse(SearchUsersResponse, {
    description: 'Get users by queries successfully',
  })
  async getListUsers(
    @Query() dto: SearchUserDto,
  ): Promise<BaseResponse<SearchUsersResponse>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/users', { params: dto })
      .then((res) => res.data);
    return getBaseResponse<SearchUsersResponse>(res, SearchUsersResponse);
  }

  @Patch('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update user',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Update user successfully',
  })
  @ApiIdParam()
  async updateUser(
    @Body() data: UpdateUserDto,
    @Param() params: RequestParamId,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/users', data, { params: { id: params.id } })
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete user successfully',
  })
  @ApiIdParam()
  async deleteRoute(@Param() params: RequestParamId): Promise<void> {
    await this.iamService.client.delete(`/users/${params.id}`);
  }
}
