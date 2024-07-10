import { DailyTips } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class DailyTipsService {
    private readonly cmsApiUrl: string;
    private readonly cmsApiPrefix: string;

    constructor(
        private readonly envConfigService: EnvConfigService,
        private readonly baseHttpService: BaseHttpService,
    ) {
        const { host: cmsApiUrl, port: cmsApiPrefix } = this.envConfigService.microservices.cms;
        this.cmsApiUrl = cmsApiUrl;
        this.cmsApiPrefix = cmsApiPrefix;
    }


    async addDailyTips(
        data: Partial<DailyTips>, 
        position?: 'above' | 'below',
        referenceTipId?: number,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/daily-tip/`,
            'POST',
            {
                dailyTipData: data,
                position,
                referenceTipId
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async findDailyTipsByDay(day: number) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/daily-tip/${day}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async findAllDailyTips(pagination: any, sortOptions: any, filters: any) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/daily-tip/`,
            'GET',
            {},
            {
                ...pagination,
                ...sortOptions,
                ...filters
            },
            {}
        );
    }
}