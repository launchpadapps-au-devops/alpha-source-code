import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';
import { EnvConfigService } from '../config/envConfig.service';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type MicroserviceName = 'notification' | 'user' | 'cms' | 'goals-activity' | 'health'

@Injectable()
export class MicroserviceClientService {
    private cmsMsUrl: string;
    private goalsActivityMsUrl: string;
    private healthMsUrl: string;
    private notificationMsUrl: string;
    private userMsUrl: string;

    constructor(private envConfigService: EnvConfigService) {
        this.cmsMsUrl = this.constructUrl('cms');
        this.goalsActivityMsUrl = this.constructUrl('goals-activity');
        this.healthMsUrl = this.constructUrl('health');
        this.notificationMsUrl = this.constructUrl('notification');
        this.userMsUrl = this.constructUrl('user');
    }

    private constructUrl(microserviceName: MicroserviceName) {
        let baseUrl = '';
        let apiPrefix = '';

        switch (microserviceName) {
            case 'cms':
                baseUrl = this.envConfigService.microservices.cms.baseUrl;
                apiPrefix = this.envConfigService.microservices.cms.apiPrefix;
                break;
            case 'goals-activity':
                baseUrl = this.envConfigService.microservices.goalsActivity.baseUrl;
                apiPrefix = this.envConfigService.microservices.goalsActivity.apiPrefix;
                break;
            case 'health':
                baseUrl = this.envConfigService.microservices.healthCheck.baseUrl;
                apiPrefix = this.envConfigService.microservices.healthCheck.apiPrefix;
                break;
            case 'notification':
                baseUrl = this.envConfigService.microservices.notification.baseUrl;
                apiPrefix = this.envConfigService.microservices.notification.apiPrefix;
                break;
            case 'user':
                baseUrl = this.envConfigService.microservices.user.baseUrl;
                apiPrefix = this.envConfigService.microservices.user.apiPrefix;
                break;
        }

        return `${baseUrl}/${apiPrefix}`;
    }

    private async exec<T>(msUrl: string, endpoint: string, method: HttpMethod, data?: any): Promise<T> {
        const url = `${msUrl}/${endpoint}`;
        let responseData;
        log(`Request sent to ${url}`);
        switch (method) {
            case 'GET':
                responseData = (await axios.get(url)).data;
                break;
            case 'POST':
                responseData = (await axios.post(url, data)).data;
                break;
            case 'PATCH':
                responseData = (await axios.patch(url, data)).data;
                break;
            case 'PUT':
                responseData = (await axios.put(url, data)).data;
                break;
            default:
                throw new InternalServerErrorException('Invalid HTTP method provided.');
        }

        return responseData.data;
    }

    public async execCms<T>(endpoint: string, method: HttpMethod, data?: any) {
        return await this.exec<T>(this.cmsMsUrl, endpoint, method, data);
    }

    public async execGoalsActivity<T>(endpoint: string, method: HttpMethod, data?: any) {
        return await this.exec<T>(this.goalsActivityMsUrl, endpoint, method, data);
    }

    public async execHealth<T>(endpoint: string, method: HttpMethod, data?: any) {
        return await this.exec<T>(this.healthMsUrl, endpoint, method, data);
    }

    public async execNotification<T>(endpoint: string, method: HttpMethod, data?: any) {
        return await this.exec<T>(this.notificationMsUrl, endpoint, method, data);
    }

    public async execUser<T>(endpoint: string, method: HttpMethod, data?: any) {
        return await this.exec<T>(this.userMsUrl, endpoint, method, data);
    }
}
