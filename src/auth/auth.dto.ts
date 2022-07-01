import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  password: string;
}

export class TokenResult {
  @ApiProperty({ type: 'string' })
  @Expose()
  accessToken: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  refreshToken: string;
}

export class SignupDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  @IsString()
  password: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  @IsString()
  confirmPassword: string;

  @ApiProperty({ type: 'string' })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  username: string;
}

export class ForgetPasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}

export class VerifyOtpQueryDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  code: string;
}

export class OtpTokenResult {
  @Expose()
  @ApiResponseProperty({ type: 'string' })
  token: string;
}

export class ResendOtpQueryDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}
