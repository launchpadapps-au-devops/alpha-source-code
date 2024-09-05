import { Module } from '@nestjs/common';

import { PGNotificationListner } from './pg-receiver';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [PGNotificationListner],
  exports: [],
})

export class HandlerModule {}
