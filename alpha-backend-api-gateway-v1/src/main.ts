import { DatabaseModule } from '@launchpadapps-au/alpha-shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { log } from 'console';
import { AppModule } from './app.module';
import { EnvConfigService } from './common/config/envConfig.service';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvConfigService);

  app.setGlobalPrefix(configService.app.apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (configService.app.env === 'development') {
    DatabaseModule.initialize({
      type: 'postgres',
      ...configService.db
    })
  }

  // TODO: Whitelist to be added in prod.
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.app.name)
    .setDescription('API Gateway')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.app.port);

  const url = `${configService.app.host}:${configService.app.port}`;
  log(`Application is running on: ${url}`);
}
bootstrap();
