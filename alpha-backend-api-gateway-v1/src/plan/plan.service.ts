import { Theme, GenericFilterDto, PaginationDto, SortingDto, Plan } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class PlanService {
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

    async createPlan(data: {
        planData: Partial<Plan>,
        themes: number[]
    }, reqUser = { userId: null }) {
        return await this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/plan`,
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

    async updatePlan(id: number, data: {
        planData: Partial<Plan>
        themes: number[]
    }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/plan/${id}`,
            'PUT',
            {
                ...data,
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async findPlanById(id: number)
    {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/plan/${id}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async findAllPlans(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' }, 
        filter: GenericFilterDto = {}
    ) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/plan`,
            'GET',
            {
            },
            {
                ...pagination,
                ...sorting,
                ...filter
            },
            {}
        );
    }
}
