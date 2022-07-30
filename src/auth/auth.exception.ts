import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'common/constants/apiCode';
import { APIException } from 'common/exceptions';

export class UnauthorizedException extends APIException {
  constructor() {
    super(
      ApiCode[401].UNAUTHORIZED.code,
      HttpStatus.FORBIDDEN,
      ApiCode[401].UNAUTHORIZED.description,
    );
  }
}

export class AccessDeniedException extends APIException {
  constructor() {
    super(
      ApiCode[403].ACCESS_DENIED.code,
      HttpStatus.FORBIDDEN,
      ApiCode[403].ACCESS_DENIED.description,
    );
  }
}
