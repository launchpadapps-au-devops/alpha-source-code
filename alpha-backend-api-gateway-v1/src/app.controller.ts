import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckDto } from './dto/health-check/health-check.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':microserviceName/health-check')
  getMicroserviceHealth(@Param() params: HealthCheckDto): Promise<string> {
    return this.appService.getMicroserviceHealth(params.microserviceName);
  }
}
