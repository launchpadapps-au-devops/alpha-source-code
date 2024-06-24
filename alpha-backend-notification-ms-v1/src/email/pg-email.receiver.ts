import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import { EmailHandler } from './email.handler';

@Injectable()
export class PGEmailNotificationListner implements OnModuleInit, OnApplicationShutdown {
    private client: Client;

    constructor(
        private configService: ConfigService,
        private emailHandler: EmailHandler,
    ) {
        console.log('PGEmailNotificationListner');
     }

    async onModuleInit() {
        const host = this.configService.get('DB_HOST');
        const port = this.configService.get('DB_PORT');
        const user = this.configService.get('DB_USER');
        const password = this.configService.get('DB_PASSWORD');
        const database = this.configService.get('DB_NAME');

        this.client = new Client({
            connectionString: `postgres://${user}:${password}@${host}:${port}/${database}`,
        });

        await this.client.connect();

        this.client.on('notification', (msg) => {
            if (msg.name === 'notification' && msg.channel === 'new_notification') {
                const payload = JSON.parse(msg.payload);
                Logger.log('New notification:', payload);

                payload.type === 'email' && this.emailHandler.handle(payload);
            }
        });

        await this.client.query('LISTEN new_notification');
    }

    async onApplicationShutdown(signal?: string) {
        if (this.client) {
            await this.client.end();
            Logger.log(`PGEmailNotificationListener shutdown due to ${signal}`);
        }
    }
}
