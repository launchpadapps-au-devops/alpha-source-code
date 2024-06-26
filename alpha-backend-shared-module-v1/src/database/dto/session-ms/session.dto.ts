import { Type } from "class-transformer";
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
    @Type(() => Date)
    accessTokenExpiresAt: Date;

    @IsDateString()
    @Type(() => Date)
    refreshTokenExpiresAt: Date;
}