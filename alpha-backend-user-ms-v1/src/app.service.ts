import { Injectable } from '@nestjs/common';
import { BaseHttpService } from './common/base-http.service';
import { MessagingService } from './common/messaging.service';
@Injectable()
export class AppService {
  constructor(
    private readonly baseHttpService: BaseHttpService,
    private readonly messagingService: MessagingService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getTestExternal() {
    return this.baseHttpService.invoke(
      'TEST_EXTERNAL_URL',
      'TEST_EXTERNAL_METHOD',
   );
  }

  async testMessageQueue() {
    return await this.messagingService.publish('hello', { message: 'Hello World!' });
  }

}
