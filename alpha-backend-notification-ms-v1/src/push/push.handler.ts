import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { 
    Notification,
    notificationService,
    userService
  } from '@launchpadapps-au/alpha-shared';
import { NotificationCategory, NotificationSubcategory } from '../common/notificationCategory';

@Injectable()
export class PushNotificationHandler {
    constructor(
        protected readonly configService: ConfigService,
    ) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL'),
        });
    }

    async handle(notificationData: Notification): Promise<void> {
        try {
            const pushData = this.getPushData(notificationData);
            const tokens = await this.getRecipientTokens(notificationData.recipients || []);

            if (tokens.length > 0) {
                await this.sendPushNotification(tokens, pushData.title, pushData.body, pushData.data);
                this.updateNotificationStatus(notificationData.id, true);
            } else {
                Logger.warn('No recipient tokens available for push notification');
                this.updateNotificationStatus(notificationData.id, false, 'No recipient tokens available');
            }
        } catch (error) {
            Logger.error('Error sending push notification:', error);
            this.updateNotificationStatus(notificationData.id, false, error.message);
        }
    }

    protected getPushData(notificationData: Notification): { title: string; body: string; data: object } {
        const pushObject = {
            title: '',
            body: '',
            data: notificationData.data,
        };
        
        switch (notificationData.categoryId) {
            case NotificationCategory.ACCOUNT_INVITATION:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.PATIENT_INVITATION:
                        pushObject.title = 'Invitation to Alpha';
                        pushObject.body = 'You have been invited to join Alpha as a patient.';
                        break;
                    case NotificationSubcategory.STAFF_INVITATION:
                        pushObject.title = 'Invitation to Alpha';
                        pushObject.body = 'You have been invited to join Alpha as a staff member.';
                        break;
                    default:
                        Logger.error('Invalid push notification category');
                }
                break;
            case NotificationCategory.ACCOUNT_AUTH:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.FORGOT_PASSWORD_OTP:
                        pushObject.title = 'Password Reset';
                        pushObject.body = 'Use the OTP provided to reset your password.';
                        break;
                    default:
                        Logger.error('Invalid push notification category');
                }
                break;
            default:
                Logger.error('Invalid push notification category');
        }

        return pushObject;
    }

    protected async getRecipientTokens(recipients: string[]): Promise<string[]> {
        const users = await userService.findUsersByIds(recipients);
        return users.map(user => user.fcmToken).filter(token => !!token);
    }

    protected async sendPushNotification(tokens: string[], title: string, body: string, data: object): Promise<void> {
        const message = {
            notification: {
                title,
                body,
            },
            data: data as { [key: string]: string }, // Ensure data is string key-value pairs
            tokens,
        };

        try {
            const response = await admin.messaging().sendMulticast(message);
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx]);
                    }
                });
                Logger.warn('Failed tokens:', failedTokens);
            } else {
                Logger.log('Push notification sent successfully');
            }
        } catch (error) {
            Logger.error('Error sending push notification:', error);
            throw new Error('Push notification sending failed');
        }
    }

    protected async updateNotificationStatus(
        notificationId: number,
        processed: boolean = true,
        error: string = 'No error found'
    ): Promise<void> {
        await notificationService.updateNotificationStatus(notificationId, processed, error);
    }
}
