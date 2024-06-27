import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BaseHttpService {
  constructor(private httpService: HttpService) {}

  private async send<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.request<T>(config));
      return response?.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      throw new HttpException('No response received', HttpStatus.GATEWAY_TIMEOUT);
    } else {
      throw new HttpException('Error setting up request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async  invoke(
    endpoint: string, 
    method: string, 
    data?: object, 
    queryParams?: object,
    headers?: object
  ): Promise<any> 
  {
     const request: AxiosRequestConfig = {
        url: endpoint,
        method: method,
        data: data,
        params: queryParams,
        headers: {
          'x-request-userId': null,
          ...headers
        }
      };

      return this.send(request)
  }
}
