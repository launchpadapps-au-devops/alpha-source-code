import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { userService, sessionService, User } from "@launchpadapps-au/alpha-shared"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async getUserByEmail(payload: { email: string }) {
        return userService.findUserBy('email', payload.email);
    }

    async validateUser(email: string, pass: string): Promise<Partial<User>> {
        const user = await userService.findUserBy('email', email);
        if (user && await userService.isPasswordMatched(email, pass)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(
        email: string,
        password: string,
        platform: string,
        deviceInfo: string,
        ipAddress: string,
    ) {
        const user = await this.validateUser(email, password);
        if(!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if(user.platform !== platform) {
            throw new UnauthorizedException('Invalid platform');
        }

        const accessToken = this.jwtService.sign({
            email: user.email,
            userType: user.userType,
            platform: user.platform,
            role: user.role,
            permission: user.permission,
            sub: user.id,
        });

        const refreshToken = this.jwtService.sign({
            email: user.email,
            userType: user.userType,
            platform: user.platform,
            role: user.role,
            permission: user.permission,
            sub: user.id,
        }, { expiresIn: '7d' });

        await sessionService.revokeAllSessionsForUser(user.id);
        await sessionService.createSession({
            userId: user.id,
            accessToken,
            refreshToken,
            deviceInfo,
            ipAddress,
            accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
            refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return { accessToken, refreshToken };
    }

    async changePassword(payload: { userId: string, password: string }) {
        return userService.updatePassword(payload.userId, payload.password);
    }

    async getForgotPasswordOtp(email: string) {
        const user = await userService.findUserBy('email', email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await userService.updateUser(user.id, { forgotPasswordOtp: otp.toString() });

        // Send OTP to user email
        return {
            otp,
            otpExpiresAt,
        };
    }

    async resetPassword(payload: { email: string, otp: number, password: string }) {
        const user = await userService.findUserBy('email', payload.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        if (!user.validateForgotPasswordOtp(payload.otp.toString())) {
            throw new UnauthorizedException('Invalid OTP');
        }

        await userService.updateUser(user.id, {
            password: payload.password,
            forgotPasswordOtp: null,
            forgotPasswordOtpExpiresAt: null,
        });
    }

    async validateToken(token: string): Promise<any> {
        const session = await sessionService.validateSessionByToken(token);
        if (!session) {
            throw new UnauthorizedException();
        }
        return this.jwtService.verify(token);
    }

    async getUserById(userId: string): Promise<any> {
        return userService.findUserById(userId);
    }
}
