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
}

export const notificationService = new NotificationService();