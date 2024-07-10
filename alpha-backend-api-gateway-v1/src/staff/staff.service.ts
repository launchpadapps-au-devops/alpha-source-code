import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { CreateStaffDto } from './staff.dto';
import { GenericFilterDto, PaginationDto, SortingDto } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class StaffService {
    private readonly userApiUrl: string;
    private readonly userApiPrefix: string;

    constructor(
        private readonly envConfigService: EnvConfigService,
        private readonly baseHttpService: BaseHttpService,
    ) {
        const { host: userApiUrl, port: userApiPrefix } = this.envConfigService.microservices.user;
        this.userApiUrl = userApiUrl;
        this.userApiPrefix = userApiPrefix;
    }

    async createStaffUserProfile(
        payload: {
            userData: CreateStaffDto,
            permissions: number[]
        },
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/staff`,
            'POST',
            {
                ...payload,
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getStaffProfiles(
        pagination: PaginationDto,
        sortOptions: SortingDto,
        filter: GenericFilterDto,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/staff`,
            'GET',
            {},
            {
                ...pagination,
                ...sortOptions,
                ...filter
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getStaffProfile(staffId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/staff/${staffId}`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async updateStaffUserProfile(
        staffId: string,
        payload: {
            userData: Partial<CreateStaffDto>,
            permissions: number[]
        },
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/staff/${staffId}`,
            'PUT',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}