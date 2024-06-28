import { TermsConditions } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class PolicyService {
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


    async addTermsConditions(data: Partial<TermsConditions>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/policy/terms-conditions`,
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

    async getTermsConditions() {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/policy/terms-conditions`,
            'GET',
            {},
            {},
            {}
        );
    }

}
