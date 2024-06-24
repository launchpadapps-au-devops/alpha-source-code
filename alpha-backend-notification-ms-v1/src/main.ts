import { DatabaseModule } from '@launchpadapps-au/alpha-shared'
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EnvConfigService } from './common/config/envConfig.service';
import { log } from 'console';

(async function () {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvConfigService);

  if (configService.app.env === 'local') {
    DatabaseModule.initialize({
      type: 'postgres',
      ...configService.db,
    });

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${configService.rabbitmq.host}:${configService.rabbitmq.port}`],
        queue: configService.rabbitmq.queue,
        queueOptions: {
          durable: false
        },
      },
    });
  
    await app.startAllMicroservices();
  }

  app.setGlobalPrefix(configService.app.apiPrefix);
  await app.listen(configService.app.port);
  log(`Application is running on: ${await app.getUrl()}`);
}());