import { Theme, GenericFilterDto, PaginationDto, SortingDto } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { bulkUpdateThemeDto } from './theme.dto';

@Injectable()
export class ThemeService {
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

    async createTheme(data: Partial<Theme>, reqUser = { userId: null }) {
        return await this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/theme`,
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

    async updateTheme(id: number, data: Partial<Theme>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/theme/${id}`,
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

    async bulkUpdateTheme(data: bulkUpdateThemeDto, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/theme/bulk`,
            'POST',
            data.themes,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async findThemeById(id: number)
    {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/theme/${id}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async findAllThemes(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' }, 
        filter: GenericFilterDto = {}
    ) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/theme`,
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
