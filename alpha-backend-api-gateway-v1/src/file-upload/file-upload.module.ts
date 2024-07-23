import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ ConfigModule, HttpModule ],
  providers: [FileUploadService, EnvConfigService],
  controllers: [FileUploadController]
})
export class FileUploadModule {}
