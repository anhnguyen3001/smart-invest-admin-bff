import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
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
import {
  CreatePermissionDto,
  SearchPermissionDto,
  SearchPermissionsResponse,
  UpdatePermissionDto,
} from './permission.dto';

@ApiBearerAuth()
@ApiTags('Permission')
@Controller({
  path: 'permissions',
  version: configService.getValue('API_VERSION'),
})
export class PermissionController {
  constructor(private readonly iamService: IAMService) {}

  @Get()
  @ApiOperation({
    summary: 'Get permissions by queries',
  })
  @ApiOkBaseResponse(SearchPermissionsResponse, {
    description: 'Get permissions by queries successfully',
  })
  async getListPermissions(
    @Query() dto: SearchPermissionDto,
  ): Promise<BaseResponse<SearchPermissionsResponse>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/permissions', { params: dto })
      .then((res) => res.data);
    return getBaseResponse<SearchPermissionsResponse>(
      res,
      SearchPermissionsResponse,
    );
  }

  @Get('/get-all')
  @ApiOperation({
    summary: 'Get all permissions',
  })
  @ApiOkBaseResponse(SearchPermissionsResponse, {
    description: 'Get all permissions successfully',
  })
  async getAllPermissions(): Promise<BaseResponse<SearchPermissionsResponse>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/permissions', { params: { getAll: true } })
      .then((res) => res.data);
    return getBaseResponse<SearchPermissionsResponse>(
      res,
      SearchPermissionsResponse,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create permission',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Create permission successfully',
  })
  async createPermission(
    @Body() dto: CreatePermissionDto,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/permissions', dto)
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Patch('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update permission',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Update permission successfully',
  })
  @ApiIdParam()
  async updatePermission(
    @Body() dto: UpdatePermissionDto,
    @Param() params: RequestParamId,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/permissions', dto, { params: { id: params.id } })
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete permission by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete permission successfully',
  })
  @ApiIdParam()
  async deletePermission(@Param() params: RequestParamId): Promise<void> {
    await this.iamService.client.delete(`/permissions/${params.id}`);
  }
}
