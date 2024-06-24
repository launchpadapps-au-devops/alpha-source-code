import { Injectable } from '@nestjs/common';
import { 
  notificationService,
  Notification
} from '@launchpadapps-au/alpha-shared';
@Injectable()
export class AppService {
  constructor() { }

  async createNotification(data: Notification) {
    return await notificationService.createNotification(data);
  }
}