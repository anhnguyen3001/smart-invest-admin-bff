import { Injectable } from '@nestjs/common';
import { configService } from 'config/config.service';
import { buildParams } from 'common/utils/request';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class IAMService {
  private readonly _client: AxiosInstance;
  constructor() {
    this._client = axios.create({
      baseURL: configService.getValue('IAM_API'),
      paramsSerializer: buildParams,
      timeout: configService.getTimeoutExternal(),
    });
  }

  get client(): AxiosInstance {
    return this._client;
  }
}
