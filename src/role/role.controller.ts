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
  CreateRoleDto,
  SearchRoleDto,
  SearchRolesResponse,
  UpdateRoleDto,
} from './role.dto';

@ApiBearerAuth()
@ApiTags('Role')
@Controller({
  path: 'roles',
  version: configService.getValue('API_VERSION'),
})
export class RoleController {
  constructor(private readonly iamService: IAMService) {}

  @Get()
  @ApiOperation({
    summary: 'Get roles by queries',
  })
  @ApiOkBaseResponse(SearchRolesResponse, {
    description: 'Get roles by queries successfully',
  })
  async getListRoles(
    @Query() dto: SearchRoleDto,
  ): Promise<BaseResponse<SearchRolesResponse>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/roles', { params: dto })
      .then((res) => res.data);
    return getBaseResponse<SearchRolesResponse>(res, SearchRolesResponse);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create role',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Create role successfully',
  })
  async createRole(
    @Body() data: CreateRoleDto,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/roles', data)
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Patch('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update role',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Update role successfully',
  })
  async updateRole(
    @Body() dto: UpdateRoleDto,
    @Param() params: RequestParamId,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/roles', dto, { params: { id: params.id } })
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete role by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete role successfully',
  })
  async deleteRole(@Param() params: RequestParamId): Promise<void> {
    await this.iamService.client.delete(`/roles/${params.id}`);
  }
}
