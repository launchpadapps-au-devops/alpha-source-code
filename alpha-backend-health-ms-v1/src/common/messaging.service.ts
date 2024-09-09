// src/messaging/messaging.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EnvConfigService } from './config/envConfig.service';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(MessagingService.name);
    private clients: { [key: string]: ClientProxy } = {};

    constructor(
        readonly envConfigService: EnvConfigService
    ) {

        this.clients['api-gateway'] = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${envConfigService.rabbitmq.host}:${envConfigService.rabbitmq.port}`],
                queue: 'apigateway_queue',
                queueOptions: {
                    durable: false,
                },
            },
        });

        this.clients['user'] = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${envConfigService.rabbitmq.host}:${envConfigService.rabbitmq.port}`],
                queue: 'user_queue',
                queueOptions: {
                    durable: false,
                },
            },
        });

        this.clients['notification'] = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${envConfigService.rabbitmq.host}:${envConfigService.rabbitmq.port}`],
                queue: 'notification_queue',
                queueOptions: {
                    durable: false,
                },
            },
        });
    }

    async onModuleInit() {
        try {
            for (const client of Object.values(this.clients)) {
                await client.connect();
            }
            this.logger.log('Connected to the message queues.');
        } catch (e) {
            this.logger.error(e);
        }
    }

    onModuleDestroy() {
        for (const client of Object.values(this.clients)) {
            client.close();
        }
    }

    async publishToApiGateway(pattern: string, data: any): Promise<void> {
        await firstValueFrom(this.clients['api-gateway'].emit(pattern, data));
    }
    
    async publishToUser(pattern: string, data: any): Promise<void> {
        await firstValueFrom(this.clients['user'].emit(pattern, data));
    }

    async publishToNotification(pattern: string, data: any): Promise<void> {
        await firstValueFrom(this.clients['notification'].emit(pattern, data));
    }
}