import { Notification } from "../entities";

export interface INotificationService {
  createNotification(data: Partial<Notification>): Promise<Notification | null>;
}
