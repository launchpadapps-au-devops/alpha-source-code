import { GenericFilterDto, PaginationDto, SortingDto } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { Lesson } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class LessonService {
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

    async createLesson(data: Partial<Lesson>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/lesson`,
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

    async updateLesson(id: number, data: Partial<Lesson>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/lesson/${id}`,
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

    async bulkUpdateLesson(data: Partial<Lesson>[], reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/lesson/bulk`,
            'POST',
            data,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async findLessonById(id: number)
    {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/lesson/${id}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async findLessonByIds(ids: number[])
    {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/lesson/bulk`,
            'GET',
            {},
            {
                lessonIds: ids.join(',')
            },
            {}
        );
    }

    async findAllLessons(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' }, 
        filter: GenericFilterDto = {}
    ) {
        return this.baseHttpService.invoke(
            `${this.cmsApiUrl}${this.cmsApiPrefix}/lesson`,
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
