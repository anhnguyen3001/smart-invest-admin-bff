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
  CreateRouteDto,
  SearchRouteDto,
  SearchRoutesResponse,
  UpdateRouteDto,
} from './route.dto';

@ApiBearerAuth()
@ApiTags('Route')
@Controller({
  path: 'routes',
  version: configService.getValue('API_VERSION'),
})
export class RouteController {
  constructor(private readonly iamService: IAMService) {}

  @Get()
  @ApiOperation({
    summary: 'Get routes by queries',
  })
  @ApiOkBaseResponse(SearchRoutesResponse, {
    description: 'Get routes by queries successfully',
  })
  async getListRoutes(
    @Query() dto: SearchRouteDto,
  ): Promise<BaseResponse<SearchRoutesResponse>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/routes', { params: dto })
      .then((res) => res.data);
    return getBaseResponse<SearchRoutesResponse>(res, SearchRoutesResponse);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create route',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Create route successfully',
  })
  async createRoute(
    @Body() dto: CreateRouteDto,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/routes', dto)
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Patch('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update route',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Update route successfully',
  })
  @ApiIdParam()
  async updateRoute(
    @Body() dto: UpdateRouteDto,
    @Param() params: RequestParamId,
  ): Promise<BaseResponse<Identity>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/routes', dto, { params: { id: params.id } })
      .then((res) => res.data);
    return getBaseResponse<Identity>(res, Identity);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete route by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete route successfully',
  })
  @ApiIdParam()
  async deleteRoute(@Param() params: RequestParamId): Promise<void> {
    await this.iamService.client.delete(`/routes/${params.id}`);
  }
}
