import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authorization, Public } from 'common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import {
  BaseResponse,
  IAMApiResponseInterface,
} from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { IAMService } from 'external/iam/iam.service';
import {
  ForgetPasswordDto,
  LoginDto,
  LoginSocialDto,
  OtpTokenResult,
  ResendOtpQueryDto,
  SignupDto,
  TokenResult,
  VerifyOtpQueryDto,
} from './auth.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: configService.getValue('API_VERSION'),
})
export class AuthController {
  constructor(private readonly iamService: IAMService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkBaseResponse(TokenResult, {
    description: 'Login successfully',
  })
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse<TokenResult>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .post('/auth/login', loginDto)
      .then((res) => res.data);
    return getBaseResponse<TokenResult>(res, TokenResult);
  }

  @Public()
  @Get('facebook')
  @ApiOperation({
    summary: 'Login Facebook',
  })
  @ApiOkBaseResponse(TokenResult, {
    description: 'Login facebook successfully',
  })
  async loginFB(
    @Query() query: LoginSocialDto,
  ): Promise<BaseResponse<TokenResult>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/auth/facebook', { params: query })
      .then((res) => res.data);

    return getBaseResponse<TokenResult>(res, TokenResult);
  }

  @Public()
  @Get('google')
  @ApiOperation({
    summary: 'Login Google',
  })
  @ApiOkBaseResponse(TokenResult, {
    description: 'Login google successfully',
  })
  async loginGoogle(
    @Query() query: LoginSocialDto,
  ): Promise<BaseResponse<TokenResult>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/auth/google', { params: query })
      .then((res) => res.data);
    return getBaseResponse<TokenResult>(res, TokenResult);
  }

  @Get('logout')
  async logout(@Authorization() authorization: string): Promise<void> {
    await this.iamService.client.get('/auth/logout', {
      headers: { authorization },
    });
  }

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Sign up',
  })
  @ApiCreatedResponse({
    description: 'Sign up successfully',
  })
  async signup(@Body() dto: SignupDto): Promise<void> {
    await this.iamService.client.post('/auth/signup', dto);
  }

  @Public()
  @Get('verify')
  @ApiOperation({
    summary: 'Verify account',
  })
  @ApiOkResponse({
    description: 'Verify account successfully',
  })
  async verifyUser(@Query() query: VerifyOtpQueryDto): Promise<void> {
    await this.iamService.client.get('/auth/verify', { params: query });
  }

  @Public()
  @Get('recover/init')
  @ApiOperation({
    summary: 'Forget password',
  })
  @ApiOkResponse({
    description: 'Forget password successfully',
  })
  async forgetPassword(@Query() query: ForgetPasswordDto): Promise<void> {
    await this.iamService.client.get('/auth/recover/init', { params: query });
  }

  @Public()
  @Get('recover/code')
  @ApiOperation({
    summary: 'Verify otp for reset password',
  })
  @ApiOkBaseResponse(OtpTokenResult, {
    description: 'Verify OTP successfully',
  })
  async recoverCode(
    @Query() query: VerifyOtpQueryDto,
  ): Promise<BaseResponse<OtpTokenResult>> {
    const res: IAMApiResponseInterface = await this.iamService.client
      .get('/auth/recover/code', { params: query })
      .then((res) => res.data);
    return getBaseResponse<OtpTokenResult>(res, OtpTokenResult);
  }

  @Public()
  @Get('resend/verify')
  @ApiOperation({
    summary: 'Resend OTP for verify user',
  })
  @ApiOkResponse({ description: 'Resend otp success' })
  async resendVerifiedOtp(@Query() query: ResendOtpQueryDto): Promise<void> {
    await this.iamService.client.get('/auth/resend', {
      params: {
        ...query,
        type: 'verifyUser',
      },
    });
  }

  @Get('refresh-token')
  @ApiOkBaseResponse(TokenResult, {
    description: 'Refresh token successfully',
  })
  async refreshToken(
    @Authorization() authorization: string,
  ): Promise<BaseResponse<TokenResult>> {
    const res: IAMApiResponseInterface = await this.iamService.client.get(
      '/auth/refesh-token',
      { headers: { authorization } },
    );
    return getBaseResponse(res, TokenResult);
  }
}
