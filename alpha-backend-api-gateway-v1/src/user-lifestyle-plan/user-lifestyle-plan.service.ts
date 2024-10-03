import { GenericFilterDto, HealthProfileQuestionaries, PaginationDto, SortingDto, UserPlan } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class UserLifeStylePlanService {
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

    async assignUserLifestylePlan(data: Partial<UserPlan>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/assign`,
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

    async unAssignUserLifestylePlan(data: Partial<UserPlan>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/un-assign`,
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

    async personalizeUserLifeStylePlan(data: Partial<UserPlan>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/personalize`,
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

    async getUserPlanProgress(reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/progress`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getUserDailyLesson(reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/daily-lessons`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async completeUserLesson(userLessonId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/daily-lessons/complete/${userLessonId}`,
            'PUT',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async feedbackUserLesson(
        userLessonId: string, 
        data: { feedback: string, isPositiveFeedback: boolean },
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/daily-lessons/feedback/${userLessonId}`,
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

    async getUserLessonFeedback(userLessonId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/daily-lessons/feedback/${userLessonId}`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async bookmarkUserLesson(userLessonId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/daily-lessons/bookmark/${userLessonId}`,
            'PUT',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getUserBookmarkedLessons(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sortOptions: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' },
        filter: GenericFilterDto = {},
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-lifetstyle-plan/daily-lessons/bookmarked`,
            'GET',
            {},
            {
                ...pagination,
                ...sortOptions,
                ...filter,
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}