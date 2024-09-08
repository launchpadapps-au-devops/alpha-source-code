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

    async getTokens(userId: string, deviceInfo?: string, ipAddress?: string) {
        const user = await userService.findUserById(userId);
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }

        const accessToken = this.jwtService.sign({
            email: user.email,
            userType: user.userType,
            platform: user.platform,
            role: user.role,
            sub: user.id,
            userId: user.id
        }, { expiresIn: '1d' });

        const refreshToken = this.jwtService.sign({
            email: user.email,
            userType: user.userType,
            platform: user.platform,
            role: user.role,
            sub: user.id,
            userId: user.id
        }, { expiresIn: '7d' });

        const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await sessionService.revokeAllSessionsForUser(user.id);
        await sessionService.createSession({
            userId: user.id,
            accessToken,
            refreshToken,
            deviceInfo: deviceInfo,
            ipAddress: ipAddress,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
        });

        return { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt };
    }

    async login(
        email: string,
        password: string,
        platform: string,
        deviceInfo: string,
        ipAddress: string,
    ) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (user.platform !== platform) {
            throw new UnauthorizedException('Invalid platform');
        }

        const tokens = await this.getTokens(user.id, deviceInfo, ipAddress);
        await userService.updateUser(user.id, { lastLoginAt: new Date() });

        return tokens;
    }

    async logout(userId: string) {
        await sessionService.revokeAllSessionsForUser(userId);
    }

    async refreshToken(refreshToken: string) {
        const session = await sessionService.validateRefreshToken(refreshToken);
        if (!session) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await userService.findUserById(session.userId);
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }

        return this.getTokens(user.id, session.deviceInfo, session.ipAddress);
    }

    async changePassword(payload: { userId: string, password: string }, reqUser = { userId: null }) {
        return userService.updateUser(payload.userId, { password: payload.password, updatedBy: reqUser.userId, isPasswordSet: true });
    }

    async getForgotPasswordOtp(email: string, reqUser = { userId: null }) {
        const user = await userService.findUserBy('email', email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await userService.updateUser(user.id, { forgotPasswordOtp: otp.toString(), updatedBy: reqUser.userId });

        // Send OTP to user email
        return {
            otp,
            otpExpiresAt,
        };
    }

    async confirmForgotPasswordOtp(payload: { email: string, otp: number }) {
        const user = await userService.findUserBy('email', payload.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        if (!user.validateForgotPasswordOtp(payload.otp.toString())) {
            throw new UnauthorizedException('Invalid OTP');
        }

        return this.getTokens(user.id);
    }

    async resetPassword(payload: { email: string, otp: number, password: string }, reqUser = { userId: null }) {
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
            updatedBy: reqUser.userId,
        });
    }

    async validateToken(token: string): Promise<any> {
        const session = await sessionService.validateSessionByToken(token);
        if (!session) {
            throw new UnauthorizedException();
        }

        return session;
    }

    async getUserById(userId: string): Promise<any> {
        return userService.findUserById(userId);
    }

    async checkPasswordMatch(payload: { email: string, password: string }) {
        const user = await userService.findUserByEmailOrFail(payload.email);
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }

        if (!user.validatePassword(payload.password)) return false; 
        return true;
    }

    async setUserFCMToken(userId: string, fcmToken: string) {
        return userService.updateUser(
            userId,
            {
                fcmToken,
                updatedBy: userId as any,
            },
            
        );
    }
}
