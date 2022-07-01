import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import { ApiCode } from '../constants/apiCode';
import { BaseResponse } from '../types/api-response.type';

export const getBaseResponse = <T>(
  response: Partial<BaseResponse<T>>,
  dataCls: ClassConstructor<T>,
  classTransformOptions?: ClassTransformOptions,
) => {
  const instance = new BaseResponse<T>();
  instance.code = response.code || ApiCode[200].DEFAULT.code;
  instance.message = response.message || ApiCode[200].DEFAULT.description;
  instance.details = response.details;

  if (response.data) {
    instance.data = plainToClass(dataCls, Object.assign({}, response.data), {
      excludeExtraneousValues: true,
      ...classTransformOptions,
    });
  }

  return instance;
};

export const getCoreErrorHttp = (err: any) => {
  if (!!err?.response)
    return {
      url: [err?.response?.config?.baseURL, err?.response?.config?.url].join(
        '',
      ),
      status: err?.response?.status,
      data: err?.response?.data,
    };
  else if (!!err.request) {
    return { url: err.request._currentUrl };
  } else return err?.message;
};
