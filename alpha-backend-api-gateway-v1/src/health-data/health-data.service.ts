import { HealthProfileQuestionaries } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class HealthDataService {
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

    async addHealthProfileQuestionaries(data: Partial<HealthProfileQuestionaries>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/health-data/questionaries`,
            'POST',
            {
                ...data,
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getHealthProfileQuestionaries(reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/health-data/questionaries`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}
