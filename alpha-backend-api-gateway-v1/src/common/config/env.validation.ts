import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
    // APP Config
    @IsString()
    @IsOptional()
    NODE_ENV: string = 'development';

    @IsNumber()
    @Type(() => Number)
    PORT: number = 3000;

    @IsString()
    HOST: string;

    @IsString()
    APP_NAME: string = 'alpha-backend-api-gateway-v1';

    @IsString()
    APP_API_PREFIX: string = '/api/v1';

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    APP_DEBUG: boolean;

    // JWT 
    @IsString()
    JWT_SECRET: string;

    @IsString()
    JWT_EXPIRES_IN: string;

    // DB Config
    @IsString()
    DB_HOST: string;

    @IsNumber()
    @Type(() => Number)
    DB_PORT: number;

    @IsString()
    DB_USER: string;

    @IsString()
    DB_PASSWORD: string;

    @IsString()
    DB_NAME: string;

    @IsString()
    REFRESH_TOKEN_EXPIRES_IN: string;

    @IsString()
    RESET_TOKEN_EXPIRES_IN: string;

    @IsString()
    CMS_MICROSERVICE_BASE_URL: string;

    @IsString()
    CMS_MICROSERVICE_API_PREFIX: string = 'api/cms-ms/v1';

    @IsString()
    GOALS_ACTIVITY_MICROSERVICE_BASE_URL: string;

    @IsString()
    GOALS_ACTIVITY_MICROSERVICE_API_PREFIX: string = 'api/goals-activity-ms/v1';

    @IsString()
    HEALTH_MICROSERVICE_BASE_URL: string;

    @IsString()
    HEALTH_MICROSERVICE_API_PREFIX: string = 'api/health-ms/v1';

    @IsString()
    NOTIFICATION_MICROSERVICE_BASE_URL: string;

    @IsString()
    NOTIFICATION_MICROSERVICE_API_PREFIX: string = 'api/notification-ms/v1';

    @IsString()
    USER_MICROSERVICE_BASE_URL: string;

    @IsString()
    USER_MICROSERVICE_API_PREFIX: string = 'api/user-ms/v1';
}
