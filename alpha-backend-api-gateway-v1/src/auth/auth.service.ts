import { Injectable } from '@nestjs/common';
import { BaseHttpService } from 'src/common/base-http.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class AuthService {
    private readonly userApiUrl: string;
    private readonly userApiPrefix: string;

    constructor(
        private readonly envConfigService: EnvConfigService,
        private readonly baseHttpService: BaseHttpService,
    ) {
        const { host: userApiUrl, port: userApiPrefix } = this.envConfigService.microservices.user;
        this.userApiUrl = userApiUrl;
        this.userApiPrefix = userApiPrefix;
    }

    async getUserByEmail(payload: { email: string }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/user/details`,
            'POST',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async matchPassword(payload: { email: string; password: string }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/user/password/match`,
            'POST',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async login(payload: { email: string; password: string, deviceInfo: string, platform: string, ipAddress: string }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/login`,
            'POST',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async logout(userId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/logout`,
            'POST',
            {},
            {},
            {
                'x-request-userId': userId
            }
        );
    }

    async refreshToken(payload: { refreshToken: string }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/refresh-token`,
            'POST',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async changePassword(userId: string, payload: { password: string }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password`,
            'POST',
            {
                ...payload,
                userId
            },
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async getForgotPasswordOtp(email: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password/otp`,
            'GET',
            {},
            { email },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async confirmForgotPasswordOtp(payload: { email: string; otp: number }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password/otp/verify`,
            'POST',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async resetPassword(payload: { email: string; otp: string; password: string }, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password/reset`,
            'PUT',
            payload,
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
    async validateToken(token: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/validate/token`,
            'GET',
            {},
            { token },
            {
                'x-request-userId': reqUser.userId
            }
        );
    }

    async validateUserById(userId: string, reqUser = { userId: null }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/user/validate/${userId}`,
            'GET',
            {},
            {},
            {
                'x-request-userId': reqUser.userId
            }
        );
    }
}
