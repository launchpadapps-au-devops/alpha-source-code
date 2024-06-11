import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto } from '../../dto/auth/auth.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/interfaces/request.interface';
import { AlphaAuthGuard } from './guards/alpha-auth.guard';
import { AuthStrategy } from './decorators/auth-strategy.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() credentials: LoginDto, @Req() request: Request) {
        const ipAddress = request.ip;
        const deviceInfo = request.headers['user-agent'];
        return this.authService.login(credentials, ipAddress, deviceInfo);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    async logout(@Req() request: AuthenticatedRequest) {
        return this.authService.logout(request.user.userId);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, AlphaAuthGuard)
    @AuthStrategy('patient')
    @Post('change-password')
    async changePassword(@Body() payload: ChangePasswordDto, @Req() request: AuthenticatedRequest) {
        return this.authService.changePassword(payload, request.user);
    } 
}
