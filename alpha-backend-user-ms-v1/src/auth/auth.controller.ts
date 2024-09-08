import { Controller, Post, Body, UseGuards, Request, Get, Headers, Query, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/user/details')
  async getUserByEmail(
    @Headers('x-request-userId') reqUserId: string, // No use case
    @Body() payload: { email: string }
  ) {
    const data = await this.authService.getUserByEmail(payload);
    return {
      message: 'User fetched successfully',
      data,
    }
  }
  
  @Post('/login')
  async login(
    @Headers('x-request-userId') reqUserId: string, // No use case
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

  @Post('/logout')
  async logout(
    @Headers('x-request-userId') reqUserId: string,
  ) {
    await this.authService.logout(reqUserId);
    return {
      message: 'Logout successful',
    }
  }

  @Post('/refresh-token')
  async refreshToken(
    @Headers('x-request-userId') reqUserId: string, // no use case
    @Body() payload: {
      refreshToken: string,
    },
  ) {
    const data = await this.authService.refreshToken(payload.refreshToken);
    return {
      message: 'Token refreshed successfully',
      data,
    }
  }

  @Post('/password')
  async changePassword(
    @Headers('x-request-userId') reqUserId: string,
    @Body() payload: { 
      userId: string,
      password: string 
    },
  ) {
    await this.authService.changePassword(payload, { userId: reqUserId });
    return {
      message: 'Password changed successfully',
    }
  }

  @Get('/password/otp')
  async getForgotPasswordOtp(
    @Headers('x-request-userId') reqUserId: string,
    @Query('email') email: string,
  ) {
    const data = await this.authService.getForgotPasswordOtp(email, { userId: reqUserId });
    return {
      message: 'OTP fetched successfully',
      data,
    }
  }

  @Post('/password/otp/verify')
  async confirmForgotPasswordOtp(
    @Headers('x-request-userId') reqUserId: string,
    @Body() payload: {
      email: string,
      otp: number,
    },
  ) {
    const data = await this.authService.confirmForgotPasswordOtp(payload);
    return {
      message: 'OTP verified successfully',
      data
    }
  }

  @Put('/password/reset')
  async resetPassword(
    @Headers('x-request-userId') reqUserId: string,
    @Body() payload: {
      email: string,
      otp: number,
      password: string,
    },
  ) {
    await this.authService.resetPassword(payload, { userId: reqUserId });
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
    @Headers('x-request-userId') reqUserId: string, // No use case
    @Query('token') token: string,
  ) {
    const data = await this.authService.validateToken(token);
    return {
      message: 'Token validated successfully',
      data,
    }
  }

  @Post('/user/password/match')
  async checkPasswordMatch(
    @Headers('x-request-userId') reqUserId: string, // No use case
    @Body() payload: {
      email: string,
      password: string,
    },
  ) {
    const data = await this.authService.checkPasswordMatch(payload);
    return {
      message: 'Password matched result',
      data: { isMatched: data },
    }
  }

  @Post('/user/fcm-token')
  async setUserFCMToken(
    @Headers('x-request-userId') reqUserId: string,
    @Body() payload: {
      fcmToken: string,
    },
  ) {
    await this.authService.setUserFCMToken(reqUserId, payload.fcmToken);
    return {
      message: 'FCM token updated successfully',
    }
  }
}
