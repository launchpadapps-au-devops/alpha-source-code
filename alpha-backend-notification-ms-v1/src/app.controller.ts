import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { 
  Notification
} from '@launchpadapps-au/alpha-shared';


@Controller('notification')
export class AppController {
  constructor(private readonly appService: AppService) { }
 
  //@MessagePattern('hello')
  @Post('register')
  async createNotification(
    @Body() data: Notification
  ) {
    return await this.appService.createNotification(data);
  }
}
