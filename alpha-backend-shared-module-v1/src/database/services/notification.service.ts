import { ILike, In, Repository, UpdateResult } from "typeorm";
import { DatabaseModule } from "../index";
import { INotificationService } from "../interfaces/INotificationService.interface";
import { Notification, NotificationType } from "../entities/notification.entity";
import { NotificationPreference } from "../entities";
import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { NotFoundException } from "@nestjs/common";

class NotificationService implements INotificationService {
  static get notificationRepository(): Repository<Notification> {
    return DatabaseModule.getRepository(Notification);
  }

  static get notificationPreferenceRepository(): Repository<NotificationPreference> {
    return DatabaseModule.getRepository(NotificationPreference);
  }

  async createNotification(data: Notification): Promise<Notification> {
    return await NotificationService.notificationRepository.save(data);
  }

  async updateNotification(notificationId: number, data: Partial<Notification>) {
    const notification = await NotificationService.notificationRepository.findOne({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new NotFoundException(`Notification Preference with id ${notificationId} not found`);
    }

    Object.assign(notification, data);
    await NotificationService.notificationRepository.save(notification);
    return notification;
  }

  async findAllNotification(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sortOptions: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
    filters: GenericFilterDto = {},
  ): Promise<{
    data: Notification[],
    totalRecords: number
    limit?: number,
    page?: number
  }> {

    const { searchText, ...restFilters } = filters;
    const [data, totalRecords] = await NotificationService.notificationRepository.findAndCount({
      relations: [],
      where: { ...restFilters },
      order: {
        [sortOptions.sortField]: sortOptions.sortOrder
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    });

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page
    };
  }

  async updateNotificationStatus(
    notificationId: number,
    processed: boolean = true,
    error: string = "No error found"
  ): Promise<void> {
    const notification = await NotificationService.notificationRepository.findOneBy({
      id: notificationId,
    });

    notification.proccessed = processed;
    notification.error = error;

    await NotificationService.notificationRepository.save(notification);
  }

  async createNotificationPreference(data: Partial<NotificationPreference[]>) {
    return NotificationService.notificationPreferenceRepository.save(data);
  }

  async updateNotificationPreference(notificationPreferenceId: string, data: Partial<NotificationPreference>) {
    const notificationPreference = await NotificationService.notificationPreferenceRepository.findOne({
      where: { id: notificationPreferenceId }
    });

    if (!notificationPreference) {
      throw new NotFoundException(`Notification Preference with id ${notificationPreferenceId} not found`);
    }

    Object.assign(notificationPreference, data);
    await NotificationService.notificationPreferenceRepository.save(notificationPreference);
    return notificationPreference;
  }

  async getNotificationPreferenceByUserId(userId: string, type = 'push' as NotificationType) {
    return NotificationService.notificationPreferenceRepository.find({
      where: { userId, type, status: In(['ACTIVE', 'INACTIVE']) }
    })
  }
}

export const notificationService = new NotificationService();