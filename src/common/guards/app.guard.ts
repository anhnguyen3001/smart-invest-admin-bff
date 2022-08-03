import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from 'auth/auth.exception';
import { IAMService } from 'external/iam/iam.service';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private readonly iamService: IAMService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // return true;
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    const [userData, routeData] = await Promise.all([
      this.iamService.client.get('/me', {
        headers: { authorization },
      }),
      this.iamService.client.get('/routes', {
        params: {
          path: request.path,
          method: request.method,
        },
      }),
    ]);

    const user = userData?.data?.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

    const route = routeData?.data?.routes?.[0];
    return (
      !route.permission ||
      user.permissions.includes(({ id }) => id === route.permission.id)
    );
  }
}
