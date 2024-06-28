import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EnvConfigService, BaseHttpService, MessagingService],
  exports: [AuthService],
})

export class AuthModule {}
