import { IsDateString, IsString } from "class-validator";

export class CreateSessionDto {
    @IsString()
    userId: string;

    @IsString()
    accessToken: string;

    @IsString()
    refreshToken: string;

    @IsString()
    ipAddress: string;

    @IsString()
    deviceInfo: string;

    @IsDateString()
    accessTokenExpiresAt: string;

    @IsDateString()
    refreshTokenExpiresAt: string;
}