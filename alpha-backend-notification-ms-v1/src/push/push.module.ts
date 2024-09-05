import { Module } from '@nestjs/common';
import { PushNotificationHandler } from './push.handler';

@Module({
  providers: [PushNotificationHandler],
  exports: [PushNotificationHandler],
})

export class PushModule {}
