import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { EnvironmentVariables } from './env.validation';

@Injectable()
export class EnvConfigService {
    private readonly logger = new Logger(EnvConfigService.name);
    private readonly envConfig: EnvironmentVariables;

    constructor(private configService: ConfigService) {
        this.envConfig = this.validateEnvConfig();
    }

    get(key: keyof EnvironmentVariables): any {
        return this.envConfig[key];
    }

    get app(){
        return {
            env: this.get('NODE_ENV') as string,
            port: this.get('PORT') as number,
            host: this.get('HOST') as string,
            name: this.get('APP_NAME') as string,
            apiPrefix: this.get('APP_API_PREFIX') as string,
            debug: this.get('APP_DEBUG') as boolean
        }
    }

    get jwt(){
        return {
            secret: this.get('JWT_SECRET') as string,
            expiresIn: this.get('JWT_EXPIRES_IN') as string,
            refreshTokenExpiresIn: this.get('REFRESH_TOKEN_EXPIRES_IN') as string,
            resetTokenExpiresIn: this.get('RESET_TOKEN_EXPIRES_IN') as string
        }
    }

    get db() {
        return {
            host: this.get('DB_HOST') as string,
            port: this.get('DB_PORT') as number,
            username: this.get('DB_USER') as string,
            password: this.get('DB_PASSWORD') as string,
            database: this.get('DB_NAME') as string
        }
    }

    get microservices() {
        return {
            cms: {
                baseUrl: this.get('CMS_MICROSERVICE_BASE_URL') as string,
                apiPrefix: this.get('CMS_MICROSERVICE_API_PREFIX') as string
            },
            goalsActivity: {
                baseUrl: this.get('GOALS_ACTIVITY_MICROSERVICE_BASE_URL') as string,
                apiPrefix: this.get('GOALS_ACTIVITY_MICROSERVICE_API_PREFIX') as string
            },
            healthCheck: {
                baseUrl: this.get('HEALTH_MICROSERVICE_BASE_URL') as string,
                apiPrefix: this.get('HEALTH_MICROSERVICE_API_PREFIX') as string
            },
            notification: {
                baseUrl: this.get('NOTIFICATION_MICROSERVICE_BASE_URL') as string,
                apiPrefix: this.get('NOTIFICATION_MICROSERVICE_API_PREFIX') as string
            },
            user: {
                baseUrl: this.get('USER_MICROSERVICE_BASE_URL') as string,
                apiPrefix: this.get('USER_MICROSERVICE_API_PREFIX') as string
            }
        }
    }

    private validateEnvConfig(): EnvironmentVariables {
        const envConfig = plainToInstance(
            EnvironmentVariables, 
            process.env, { enableImplicitConversion: true }
        );

        const errors = validateSync(envConfig, { skipMissingProperties: false });
        if (errors.length > 0) {
            const errorsForLog = this.formatErrors(errors);
            this.logger.error(`Environment validation errors: ${errorsForLog}`);
            throw new Error('Environment validation error');
        }

        return envConfig;
    }

    private formatErrors(errors: ValidationError[]): string {
        return errors
            .map(error => {
                if (error.constraints) {
                    return Object.values(error.constraints).join('. ');
                }
                return `${error.property} validation error`;
            })
            .join(', ');
    }
}
