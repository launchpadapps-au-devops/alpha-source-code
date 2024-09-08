import { ILike, In, MoreThan, Repository, UpdateResult } from "typeorm";
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

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    return await NotificationService.notificationRepository.save(data);
  }

  async addUpdateBulkNotification(data: Partial<Notification[]>): Promise<Notification[]> {
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
    totalRecords: number,
    limit?: number,
    page?: number
  }> {
  
    const { searchText, userIds, fromDate, toDate,  ...restFilters } = filters;
  
    const isPaginationProvided = pagination && pagination.limit && pagination.page;
  
    const queryOptions: any = {
      relations: [],
      where: {
        ...(searchText ? { title: ILike(`%${searchText}%`) } : {}),
        ...(userIds ? { userId: In(userIds) } : {}),
        ...(fromDate ? { createdAt: MoreThan(fromDate) } : {}),
        ...(toDate ? { createdAt: MoreThan(toDate) } : {}),
        ...restFilters 
      },
      order: {
        [sortOptions.sortField]: sortOptions.sortOrder
      }
    };
  
    // Apply skip and take only if pagination is provided
    if (isPaginationProvided) {
      queryOptions.skip = (pagination.page - 1) * pagination.limit;
      queryOptions.take = pagination.limit;
    }
  
    // Fetch data and total count
    const [data, totalRecords] = await NotificationService.notificationRepository.findAndCount(queryOptions);
  
    return {
      data,
      totalRecords,
      limit: isPaginationProvided ? pagination.limit : undefined,
      page: isPaginationProvided ? pagination.page : undefined
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