import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export const Public = () => SetMetadata('isPublic', true);

export const Authorization = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.authorization;
  },
);

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);

export const GetUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);

export const ApiIdParam = () => {
  return applyDecorators(
    ApiParam({
      name: 'id',
      type: 'number',
      required: false,
    }),
  );
};
