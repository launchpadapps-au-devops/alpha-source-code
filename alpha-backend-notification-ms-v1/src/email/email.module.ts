import { Module } from '@nestjs/common';

import { PGEmailNotificationListner } from './pg-email.receiver';
import { EmailHandler } from './email.handler';

@Module({
  providers: [EmailHandler, PGEmailNotificationListner],
  exports: [],
})

export class EmailModule {}
