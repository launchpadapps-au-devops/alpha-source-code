import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError, retry, delay } from 'rxjs/operators';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class BaseHttpService {
  private readonly logger = new Logger(BaseHttpService.name);

  constructor(private httpService: HttpService) {}

  private async send<T>(config: AxiosRequestConfig): Promise<T> {
    // Create new HTTP/HTTPS agents with keep-alive disabled
    const httpAgent = new http.Agent({ keepAlive: false });
    const httpsAgent = new https.Agent({ keepAlive: false });

    // Add the appropriate agent based on the protocol
    config.httpAgent = httpAgent;
    config.httpsAgent = httpsAgent;

    this.logger.debug(`Sending request to ${config.url} with method ${config.method}`);
    this.logger.debug(`Request config: ${JSON.stringify(config)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.request<T>(config).pipe(
          retry({ count: 3, delay: 1000 }), // Retry up to 3 times with a 1-second delay
          catchError((error: AxiosError) => {
            this.logger.error(`Error occurred: ${error.message}`, error.stack);
            if (error.response) {
              this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
              this.logger.error(`Response status: ${error.response.status}`);
            }
            return throwError(() => this.handleError(error));
          })
        )
      );
      this.logger.debug(`Response received: ${JSON.stringify(response.data)}`);
      return response?.data;
    } catch (error) {
      // Handle any unexpected errors here
      if (error instanceof AxiosError) {
        this.handleError(error);
      } else {
        this.logger.error('Unexpected error', error);
        throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      this.logger.error(`HTTP error response: ${JSON.stringify(error.response.data)}`);
      this.logger.error(`HTTP error status: ${error.response.status}`);
      this.logger.error(`HTTP error headers: ${JSON.stringify(error.response.headers)}`);
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      this.logger.error('No response received');
      this.logger.error(`Request made: ${JSON.stringify(error.request)}`);
      throw new HttpException('No response received', HttpStatus.GATEWAY_TIMEOUT);
    } else {
      this.logger.error('Error setting up request');
      this.logger.error(`Error message: ${error.message}`);
      throw new HttpException('Error setting up request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async invoke(
    endpoint: string, 
    method: string, 
    data?: object, 
    queryParams?: object,
    headers?: object
  ): Promise<any> {
    const request: AxiosRequestConfig = {
      url: endpoint,
      method: method,
      data: data,
      params: queryParams,
      headers: {
        'x-request-userId': null,
        ...headers
      },
      timeout: 50000, // Set a reasonable timeout
    };

    return this.send(request);
  }
}
