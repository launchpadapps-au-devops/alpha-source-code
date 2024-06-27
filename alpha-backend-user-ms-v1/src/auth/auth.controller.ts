import { Controller, Post, Body, UseGuards, Request, Get, Headers, Query, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/user/details')
  async getUserByEmail(@Body() payload: { email: string }) {
    const data = await this.authService.getUserByEmail(payload);
    return {
      message: 'User fetched successfully',
      data,
    }
  }
  
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

  @Get('/password/otp')
  async getForgotPasswordOtp(
    @Query('email') email: string,
  ) {
    const data = await this.authService.getForgotPasswordOtp(email);
    return {
      message: 'OTP fetched successfully',
      data,
    }
  }

  @Put('/password/reset')
  async resetPassword(
    @Body() payload: {
      email: string,
      otp: number,
      password: string,
    },
  ) {
    await this.authService.resetPassword(payload);
    return {
      message: 'Password reset successfully',
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
