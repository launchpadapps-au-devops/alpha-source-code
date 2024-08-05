import { UserMealLog, GenericFilterDto, PaginationDto, SortingDto, Plan } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class UserMealService {
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

    async createUserMealLog(data: Partial<UserMealLog>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-meal`,
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

    async updateUserMealLog(id: string, data: Partial<UserMealLog>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-meal/${id}`,
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

    async findUserMealLogById(id: string) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-meal/${id}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async findAllUserMealLogs(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' },
        filter: GenericFilterDto = {}
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-meal`,
            'GET',
            {},
            {
                ...pagination,
                ...sorting,
                ...filter
            },
            {}
        );
    }
}
