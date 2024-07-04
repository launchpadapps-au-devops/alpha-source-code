import { Category, GenericFilterDto, PaginationDto, SortingDto } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { bulkUpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
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

    async createCategory(data: Partial<Category>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/category`,
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

    async updateCategory(id: number, data: Partial<Category>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/category/${id}`,
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

    async bulkUpdateCategory(data: bulkUpdateCategoryDto, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/category/bulk`,
            'POST',
            data.categories,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async findCategoryById(id: number) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/category/${id}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async findAllCategories(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' }, 
        filter: GenericFilterDto = {}
    ) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/category`,
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
