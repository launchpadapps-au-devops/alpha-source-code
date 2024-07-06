import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ThemeService, EnvConfigService, BaseHttpService],
  controllers: [ThemeController]
})

export class ThemeModule {}
