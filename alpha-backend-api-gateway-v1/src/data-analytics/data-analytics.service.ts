import { GenericFilterDto, SortingDto, UserHealthData } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class DataAnalyticService {
   private readonly healthApiUrl: string;
    private readonly healthApiPrefix: string;

    constructor(
        private readonly envConfigService: EnvConfigService,
        private readonly baseHttpService: BaseHttpService,
    ) {
        const { host: heathApiUrl, port: healthApiPrefix } = this.envConfigService.microservices.health;
        this.healthApiUrl = heathApiUrl;
        this.healthApiPrefix = healthApiPrefix;
    }

    async getPatientDataOverview(
        userId?: string,
        fromDate?: Date,
        toDate?: Date,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/data-analytics/patient-data/overview/${userId}`,
            'GET',
            {},
            {
                userId,
                fromDate,
                toDate
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getActivePatients(
        fromDate?: Date,
        toDate?: Date,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/data-analytics/active-patients`,
            'GET',
            {},
            {
                fromDate,
                toDate
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getEnrollements(
        fromDate?: Date,
        toDate?: Date,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/data-analytics/enrollements`,
            'GET',
            {},
            {
                fromDate,
                toDate
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getLessonFeedbacks(
        userId?: string,
        categoryId?: string,
        themeId?: string,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/data-analytics/lesson-feedbacks`,
            'GET',
            {},
            {
                userId,
                categoryId,
                themeId
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}
