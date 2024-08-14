import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class UserDailyHabitsService {
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

    async getUserDailyHabitOptions(userId: string, reqUser = { userId: null }) {
       return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-daily-habits/options`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getUserDailyHabit(userId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-daily-habits/current`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async selectUserDailyHabits(userId: string, habitIds: string[], reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-daily-habits/select`,
            'PUT',
            habitIds,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async startUserDailyHabit(userHabitId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-daily-habits/start`,
            'PUT',
            {
                userHabitId
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }


    async completeUserDailyHabitProgress(userHabitProgressId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.healthApiUrl}${this.healthApiPrefix}/user-daily-habits/complete`,
            'PUT',
            {
                userHabitProgressId
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}
