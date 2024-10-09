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

  async bulkUpdateNotification(data: Partial<Notification> [], reqUser = { userId: null }) {
    return await notificationService.addUpdateBulkNotification(
      data.map(d => ({
        ...d,
        createdBy: reqUser.userId,
        updatedBy: reqUser.userId,
      })) as any
    )
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
    
    return notificationPreference.reduce((acc, preference) => {
      const { categoryId, subcategoryId } = preference;
      const existingPreference = acc.find(({ categoryId: id }) => id === categoryId);

      if(!existingPreference) {
        acc.push({
          ...preference,
          subCategory: [subcategoryId]
        });
      } else {
        existingPreference.subCategory.push(subcategoryId);
      }

      return acc;
    }, [] as any);
  }

  async updateNotificationPreference(notificatoinPreferenceId: string, data: Partial<NotificationPreference>, reqUser = { userId: null }) {
    const notificationPreferences = await notificationService.getNotificationPreferenceByUserId(reqUser.userId);
    const currentPreference = notificationPreferences.find(({ id }) => id === notificatoinPreferenceId);

    if(!currentPreference) {
      throw new Error('Notification preference not found');
    }

    await notificationService.updateNotificationPreference(
      notificatoinPreferenceId,
      {
        ...data,
        updatedBy: reqUser.userId
      }
    );

    if(data.status) {
      const categoryPreferences = notificationPreferences.filter(({ categoryId }) => categoryId === currentPreference.categoryId);

      const prefereceToUpdate = [] as any;
      for(const preference of categoryPreferences) {
        prefereceToUpdate.push({
          id: preference.id,
          status: data.status,
          updatedBy: reqUser.userId
        });
      }

      await notificationService.updateNotificationPreferenceBulk(prefereceToUpdate);
    }

    return currentPreference;
  }
}