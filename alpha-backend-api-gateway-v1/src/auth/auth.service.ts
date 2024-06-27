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

    async getUserByEmail(payload: { email: string }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/user/details`,
            'POST',
            payload
        );
    }

    async matchPassword(payload: { email: string; password: string }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/user/password/match`,
            'POST',
            payload
        );
    }

    async login(payload: { email: string; password: string, deviceInfo: string, platform: string, ipAddress: string }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/login`,
            'POST',
            payload
        );
    }

    async changePassword(userId: string, payload: { password: string }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password`,
            'POST',
            {
                ...payload,
                userId
            }
        );
    }

    async getForgotPasswordOtp(email: string) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password/otp`,
            'GET',
            {},
            { email }
        );
    }

    async resetPassword(payload: { email: string; otp: string; password: string }) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/password/reset`,
            'PUT',
            payload
        );
    }

    async validateToken(token: string) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/validate/token`,
            'GET',
            {},
            { token }
        );
    }

    async validateUserById(userId: string) {
        return this.baseHttpService.invoke(
            `${this.userApiUrl}${this.userApiPrefix}/auth/user/validate/${userId}`,
            'GET'
        );
    }
}
