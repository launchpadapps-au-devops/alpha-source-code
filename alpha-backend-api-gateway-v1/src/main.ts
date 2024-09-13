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
import { log } from 'console';
import { ValidationPipe } from '@nestjs/common';

(async function () {

  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })

  const configService = app.get(EnvConfigService);

  // Holding this till we setup the database and rabbitmq in services
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

  app.setGlobalPrefix(configService.app.apiPrefix);

  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,  // Remove any properties that are not in the DTO
  //   //forbidNonWhitelisted: true,  // Throw an error if extra properties are sent
  //   transform: true,  // Automatically transform payloads to DTO instances
  // }));

  const config = new DocumentBuilder()
    .setTitle('🙋‍♂️⚙️ Alpha Backend API Gateway')
    .setDescription(
      `🚀 **Welcome to the Alpha Project API Documentation!**
      This API is the backbone of the Alpha project, designed to provide a secure and efficient user experience.
  Dive into our detailed documentation for insights on integrating with our endpoints!`
    )
    .setVersion('1.0')
    .addBearerAuth()
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
  log(`🚀 Server running on http://localhost:${configService.app.port}${configService.app.apiPrefix}`);
}());