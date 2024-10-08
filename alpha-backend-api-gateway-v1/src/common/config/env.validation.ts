import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class EnvironmentVariables {
    // APP Config
    @IsString()
    @IsOptional()
    NODE_ENV: string = 'development';

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    PORT: number = 3000;

    @IsString()
    @IsOptional()
    APP_NAME: string = 'alpha-user-ms-v1';

    @IsString()
    @IsOptional()
    APP_API_PREFIX: string = '/api/user';

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    APP_DEBUG: boolean;

    @IsString()
    @IsOptional()
    SUPER_ADMIN_TOKEN: string = '@su93r@dm1n';

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

    // RabbitMQ Config
    @IsString()
    RABBITMQ_HOST: string;

    @IsNumber()
    RABBITMQ_PORT: number;

    @IsString()
    RABBITMQ_USERNAME: string;

    @IsString()
    RABBITMQ_PASSWORD: string;

    @IsString()
    RABBITMQ_QUEUE: string;

    // File Upload 
    @IsString()
    @IsOptional()
    AZURE_STORAGE_ACCOUNT_NAME: string;

    @IsString()
    @IsOptional()
    AZURE_STORAGE_ACCOUNT_KEY: string;

    @IsString()
    @IsOptional()
    AZURE_STORAGE_CONTAINER_NAME: string;

    // External Microservices
    // Health Service
    @IsString()
    HEALTH_SERVICE_BASE_URL: string;
    @IsString()
    HEALTH_SERVICE_API_PREFIX: string;

    // User Service
    @IsString()
    USER_SERVICE_BASE_URL: string;
    @IsString()
    USER_SERVICE_API_PREFIX: string;

    // Content Service
    @IsString()
    CMS_SERVICE_BASE_URL: string;
    @IsString()
    CMS_SERVICE_API_PREFIX: string;

    // Notification Service
    @IsString()
    NOTIFICATION_SERVICE_BASE_URL: string;
    @IsString()
    NOTIFICATION_SERVICE_API_PREFIX: string;
}
