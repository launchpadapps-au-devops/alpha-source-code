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
}
