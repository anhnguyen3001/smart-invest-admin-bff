import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IAMService } from 'external/iam/iam.service';
import { AccessDeniedException } from '../../auth/auth.exception';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private readonly iamService: IAMService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    const user = await this.iamService.client.get('/me', {
      headers: { authorization },
    });
    if (!user) {
      throw new AccessDeniedException();
    }

    request.user = user;
    return true;
  }
}
