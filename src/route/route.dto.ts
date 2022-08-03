import { ApiProperty, ApiResponseProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BASE_SORT_BY, QueryCoreDto, ResponseWithPagination } from 'common/dto';

enum MethodEnum {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

export class RouteDto {
  @Expose()
  @ApiProperty({ type: 'number' })
  id: number;

  @Expose()
  @ApiProperty({ type: 'string' })
  route: string;

  @Expose()
  @ApiProperty({ enum: MethodEnum })
  method: MethodEnum;
}

const ROUTE_SORT_BY = BASE_SORT_BY;
export class SearchRouteDto extends QueryCoreDto {
  @ApiProperty({ enum: ROUTE_SORT_BY, default: 'id', required: false })
  @IsIn(ROUTE_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';
}

export class SearchRoutesResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [RouteDto] })
  @Type(() => RouteDto)
  routes: RouteDto[];
}

export class CreateRouteDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  regUri: string;

  @ApiProperty({ enum: MethodEnum })
  @IsEnum(MethodEnum)
  method: MethodEnum;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  permissionId?: number;
}

export class UpdateRouteDto extends PartialType(CreateRouteDto) {}
