import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '@launchpadapps-au/alpha-shared'
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';
import { TransformInterceptor } from './app/interceptor/response.interceptor';
import { HttpExceptionFilter } from './app/filters/http-exception.filter';
import { EnvConfigService } from './common/config/envConfig.service';
import { SuccessResponse, ValidationError, InternalServerError } from './common/dto/response.dto';

(async function () {

  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(EnvConfigService);

  // Holding this till we setup the database and rabbitmq in services
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

  const config = new DocumentBuilder()
    .setTitle('🙋‍♂️⚙️ Alpha User Microservice')
    .setDescription(
  `🚀 **Welcome to the Alpha Project API Documentation!**
      This API is the backbone of the Alpha project, designed to provide a secure and efficient user experience. Here’s what you can do with our API:
  - **User Registration 📝**: Easily create new user accounts, kickstarting the onboarding process with simplicity.
  - **Authentication and Security 🔒**: Leverage robust security measures for user login, including token generation and verification, to protect user data.
  - **Profile Management 🔄**: Users can effortlessly view and update their profile information, maintaining control over their personal data.
  - **Role-Based Access Control (RBAC) 🔑**: Access policies are defined and enforced to ensure users only interact with data and functionalities that are relevant to their roles.
      
  Dive into our detailed documentation for insights on integrating with our endpoints!`
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      SuccessResponse,
      ValidationError,
      InternalServerError
    ],
  });


  const theme = new SwaggerTheme();
  SwaggerModule.setup('api', app, document, { explorer: true, customCss: theme.getBuffer(SwaggerThemeNameEnum.NORD_DARK) });

  // save documentation to file
  await app.listen(configService.app.port);
  console.log(`🚀 Server running on http://localhost:${configService.app.port}${configService.app.apiPrefix}`);
}());