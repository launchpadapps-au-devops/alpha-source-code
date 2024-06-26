import { Controller, Post, Body, UseGuards, Request, Get, Headers, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(
    @Body() payload: {
      email: string;
      password: string,
      platform: string,
      deviceInfo: string,
      ipAddress: string
    },
  ) {
    const loginReponse = await this.authService.login(
      payload.email,
      payload.password,
      payload.platform,
      payload.deviceInfo,
      payload.ipAddress,
    );

    return {
      message: 'Login successful',
      data: loginReponse,
    }
  }

  @Post('/password')
  async changePassword(
    @Body() payload: { 
      userId: string,
      password: string 
    },
  ) {
    await this.authService.changePassword(payload);
    return {
      message: 'Password changed successfully',
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('validate/token')
  async validateToken(
    @Query('token') token: string,
  ) {
    return this.authService.validateToken(token);
  }
}
