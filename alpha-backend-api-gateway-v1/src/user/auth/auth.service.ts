import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../dto/auth/auth.dto';
import { DateUtil, UserDto, userService } from '@launchpadapps-au/alpha-shared';
import { ChangePasswordDto } from '../../dto/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigService } from '../../common/config/envConfig.service';
import { sessionService } from '@launchpadapps-au/alpha-shared';
import { RequesterDetails } from '../../common/interfaces/request.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private envConfigService: EnvConfigService
    ) {}

    private generateTokens(user: UserDto, action = 'login') {
        switch(action) {
            case 'login': {
                const accessToken = this.jwtService.sign({ userId: user.id, email: user.email, tokenType: 'access' });
                const refreshToken = this.jwtService.sign({ userId: user.id, email: user.email, tokenType: 'refresh' }, { expiresIn: this.envConfigService.jwt.refreshTokenExpiresIn });
                return { accessToken, refreshToken };
            }
            case 'reset': {
                const resetToken = this.jwtService.sign({ userId: user.id, email: user.email, tokenType: 'reset' }, { expiresIn: this.envConfigService.jwt.resetTokenExpiresIn });
                return { resetToken };
            }
            default:
                return null;
        }
    }

    private calculateTokenExpirationTimes() {
        const daysUntilAccessTokenExpiry = parseInt(this.envConfigService.jwt.expiresIn[0]);
        const daysUntilRefreshTokenExpiry = parseInt(this.envConfigService.jwt.refreshTokenExpiresIn[0]);

        return {
            accessTokenExpiry: DateUtil.addDays(new Date(), daysUntilAccessTokenExpiry),
            refreshtokenExpiry: DateUtil.addDays(new Date(), daysUntilRefreshTokenExpiry)
        };
    }

    async login(creds: LoginDto, ipAddress: string, deviceInfo: string) {
        let user: UserDto;
        try {
            user = await userService.findUserByEmailOrFail(creds.email);
        } catch (exception) {
            if (exception.constructor.name === 'EntityNotFoundError') {
                throw new NotFoundException('User with email not found');
            }
            throw new InternalServerErrorException('Internal server error');
        }

        const isPasswordValid = await userService.isPasswordMatched(creds.email, creds.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await sessionService.revokeAllSessionsForUser(user.id);


        const { accessToken, refreshToken } = this.generateTokens(user);
        const tokenExpiryTimes = this.calculateTokenExpirationTimes();
        const session = await sessionService.createSession({
             userId: user.id, 
             accessToken, 
             refreshToken, 
             ipAddress, 
             deviceInfo, 
             accessTokenExpiresAt: tokenExpiryTimes.accessTokenExpiry.toISOString(), 
             refreshTokenExpiresAt: tokenExpiryTimes.refreshtokenExpiry.toISOString() 
        });

        return {
            user: {
                id: user.id,
                email: user.email
            },
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        };
    }


    async logout(userId: string) {
        return sessionService.revokeAllSessionsForUser(userId);
    }

    async changePassword(payload: ChangePasswordDto, userDetails: RequesterDetails) {
        const isOldPasswordValid = await userService.isPasswordMatched(userDetails.email, payload.oldPassword);
        if (!isOldPasswordValid) {
            throw new UnauthorizedException('The old password given does not match the current password');
        }

        return userService.updatePassword(userDetails.userId, payload.newPassword);;
    }
}
