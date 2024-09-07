import { Injectable } from '@nestjs/common';
import {
  notificationService,
  Notification,
  PaginationDto,
  SortingDto,
  GenericFilterDto,
  NotificationPreference
} from '@launchpadapps-au/alpha-shared';
import { NotificationPreferenceInit } from './common/notificationCategory';
@Injectable()
export class AppService {
  constructor() { }

  async createNotification(data: Notification, reqUser = { userId: null }) {
    return await notificationService.createNotification({
      ...data,
      createdBy: reqUser.userId,
      updatedBy: reqUser.userId,
    });
  }

  async updateNotification(notificationId: number, data: Notification, reqUser = { userId: null }) {
    return await notificationService.updateNotification(
      notificationId,
      {
        ...data,
        createdBy: reqUser.userId,
        updatedBy: reqUser.userId,
      }
    );
  }

  async findAllNotification(
    page: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
    filters: GenericFilterDto = {}
  ): Promise<{ data: Notification[], totalRecords: number, page?: number, limit?: number }> {
    return notificationService.findAllNotification(page, sorting, filters);
  }

  async getNotificationPreference(userId: string) {
    let notificationPreference = await notificationService.getNotificationPreferenceByUserId(userId);
    if(!notificationPreference?.length) {
      const newNotificationPreference = []
      for(const { category: categoryId, subCategory } of NotificationPreferenceInit) {
        for(const subcategoryId of subCategory) {
          newNotificationPreference.push({ userId, categoryId, subcategoryId })
        }
      }

      await notificationService.createNotificationPreference(newNotificationPreference as Partial<NotificationPreference []>)
      return this.getNotificationPreference(userId);
    }

    return notificationPreference;
  }

  async updateNotificationPreference(notificatoinPreferenceId: string, data: Partial<NotificationPreference>, reqUser = { userId: null }) {
    return notificationService.updateNotificationPreference(notificatoinPreferenceId, {
      ...data,
      createdBy: reqUser.userId,
      updatedBy: reqUser.userId
    });
  }
}