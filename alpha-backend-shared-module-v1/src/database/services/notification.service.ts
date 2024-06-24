import { Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { INotificationService } from "../interfaces/INotificationService.interface";
import { Notification } from "../entities/notification.entity";

class NotificationService implements INotificationService {
  static get notificationRepository(): Repository<Notification> {
    return DatabaseModule.getRepository(Notification);
  }

  async createNotification(data: Notification): Promise<Notification> {
    return await NotificationService.notificationRepository.save(data);
  }
}

export const notificationService = new NotificationService();