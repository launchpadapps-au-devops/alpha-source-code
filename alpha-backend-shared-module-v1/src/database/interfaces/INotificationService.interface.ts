import { Notification } from "../entities";

export interface INotificationService {
  createNotification(data: Notification): Promise<Notification | null>;
}
