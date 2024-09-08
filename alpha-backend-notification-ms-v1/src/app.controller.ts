import { Body, Controller, Get, Head, Header, Headers, Param, Post, Put, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { 
  Notification,
  NotificationPreference,
  SortOrderType
} from '@launchpadapps-au/alpha-shared';


@Controller('notification')
export class AppController {
  constructor(private readonly appService: AppService) { }
 
  @Post('register')
  async createNotification(
    @Headers('x-request-userId') reqUserId: string,
    @Body() data: Notification
  ) {
    return await this.appService.createNotification(data, { userId: reqUserId });
  }

  @MessagePattern('notification.register')
  async createNotificationHandler(data: Notification) {
    return await this.appService.createNotification(data);
  }

  @Get('preference/:userId')
  async getNotificationPreference(
    @Param() userId: string
  ) {
    const data =  await this.appService.getNotificationPreference(userId);
    return {
      message: `Notification Preference Fetched Successfully`,
      data
    }
  }

  @Put('preference/:notificationPreferenceId')
  async updateNotificationPreference(
    @Headers('x-request-userId') reqUserId: string,
    @Param() notificationPreferenceId: string,
    @Body() payload: NotificationPreference
  ) {
    const data = await this.appService.updateNotificationPreference(notificationPreferenceId, payload, { userId: reqUserId });
    return {
      message: `Notification preference with Id ${data.id} updated successfully`,
      data: { id: data.id }
    }
 }
  
  @Get()
  async getNotification(
      @Headers('x-request-userId') reqUserId: string,
      @Request() req
  ) {
      const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
      const repsonse = await this.appService.findAllNotification(
          {
              page: Number(page),
              limit: Number(limit),
          },
          {
              sortField,
              sortOrder: sortOrder as SortOrderType
          },
          { 
              ...filters,
          }
      );
      return {
          message: `Notifications fetched successfully`,
          data: repsonse.data,
          meta: {
              page: repsonse.page,
              limit: repsonse.limit,
              totalRecords: repsonse.totalRecords,
              totalPages: Math.ceil(repsonse.totalRecords / repsonse.limit)
          }
      }
  }

  @Put('/:notificationId')
  async updateNotification(
    @Param() notificationId: number,
    @Body() payload: Notification
  ) {
    const data = await this.appService.updateNotification(notificationId, payload);
    return {
      message: `Notification Updated Successfully`,
      data: { id: data.id }
    }
  }
}
