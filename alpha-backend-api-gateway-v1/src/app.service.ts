import { MicroserviceName } from '@launchpadapps-au/alpha-shared';
import { Injectable } from '@nestjs/common';
import { MicroserviceClientService } from './common/microservice-client/microservice-client.service';
@Injectable()
export class AppService {
  constructor(private microserviceClientService: MicroserviceClientService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getMicroserviceHealth(microserviceName: MicroserviceName): Promise<string> {
    switch (microserviceName) {
      case 'cms-ms':
        return this.microserviceClientService.execCms('health-check', 'GET');
      case 'goals-activity-ms':
        return this.microserviceClientService.execGoalsActivity('health-check', 'GET');
      case 'health-ms':
        return this.microserviceClientService.execHealth('health-check', 'GET');
      case 'notification-ms':
        return this.microserviceClientService.execNotification('health-check', 'GET');
      case 'user-ms':
        return this.microserviceClientService.execUser('health-check', 'GET');
    }
  }
}
