import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import {
  BaseEntityDto,
  BASE_SORT_BY,
  QueryCoreDto,
  ResponseWithPagination,
} from 'common/dto';
import { RoleDto } from 'role/role.dto';

enum LoginMethodEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
}

export class UserDto extends BaseEntityDto {
  @Expose()
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  email: string;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  username: string;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  password: string;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  avatar?: string;

  @Expose()
  @ApiProperty({
    type: 'boolean',
  })
  isVerified?: boolean;

  @Expose()
  @ApiProperty({
    enum: LoginMethodEnum,
  })
  method?: LoginMethodEnum;

  @Expose()
  @ApiProperty({
    type: RoleDto,
  })
  role?: RoleDto;
}

export class UserResponseDto {
  @Expose()
  @ApiResponseProperty({ type: UserDto })
  @Type(() => UserDto)
  user: UserDto;
}

const USER_SORT_BY = BASE_SORT_BY;
export class SearchUserDto extends QueryCoreDto {
  @ApiProperty({ enum: USER_SORT_BY, default: 'id', required: false })
  @IsIn(USER_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';

  @ApiProperty({ enum: LoginMethodEnum, required: false })
  @IsIn(Object.values(LoginMethodEnum))
  @IsOptional()
  method?: string;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

export class SearchUsersResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [UserDto] })
  @Type(() => UserDto)
  users: UserDto[];
}

export class UpdateUserDto {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @Matches(PATTERN_VALIDATION.password)
  password?: string;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsOptional()
  roleId?: number;
}
