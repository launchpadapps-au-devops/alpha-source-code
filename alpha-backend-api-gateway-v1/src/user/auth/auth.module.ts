import { EnvConfigModule } from './../../common/config/envConfig.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigService } from '../../common/config/envConfig.service';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (envConfigService: EnvConfigService) => ({
        secret: envConfigService.jwt.secret,
        signOptions: { expiresIn: envConfigService.jwt.expiresIn }
      })
    }),
    EnvConfigModule
  ],
})
export class AuthModule {}
