import { GenericFilterDto, NotificationPreference, PaginationDto, SortingDto } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { Notification } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class NotificationService {
    private readonly notificationApiUrl: string;
    private readonly notificationApiPrefix: string;

    constructor(
        private readonly envConfigService: EnvConfigService,
        private readonly baseHttpService: BaseHttpService,
    ) {
        const { host: notificationApiUrl, port: notificationApiPrefix } = this.envConfigService.microservices.notification;
        this.notificationApiUrl = notificationApiUrl;
        this.notificationApiPrefix = notificationApiPrefix;
    }

    async getNotifications(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' }, 
        filter: GenericFilterDto = {}
    ) {
        return this.baseHttpService.invoke(
            `${this.notificationApiUrl}${this.notificationApiPrefix}/notification`,
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

    async updateNotification(
        notificationId: number,
        data: Partial<Notification>,
        reqUser = { userId: null }
    ) {
        return this.baseHttpService.invoke(
            `${this.notificationApiUrl}${this.notificationApiPrefix}/${notificationId}`,
            'PUT',
            {
                data
            },
            {
            },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getUserNotificationPreference(userId: string) {
        return this.baseHttpService.invoke(
            `${this.notificationApiUrl}${this.notificationApiPrefix}/notification/preference/${userId}`,
            'GET',
            {},
            {},
            {}
        );
    }

    async updateUserNotificationPreference(notificationPreferenceId: string, data: Partial<NotificationPreference>, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.notificationApiUrl}${this.notificationApiPrefix}/notification/preference/${notificationPreferenceId}`,
            'PUT',
            {
                data
            },
            {
            },
            {
                'x-request-userId': reqUser.userId
            }
        ); 
    }
}
