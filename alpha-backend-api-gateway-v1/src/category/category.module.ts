import { Module } from '@nestjs/common';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [CategoryController],
  providers: [CategoryService, EnvConfigService, BaseHttpService]
})
export class CategoryModule {}
