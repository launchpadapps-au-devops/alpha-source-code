import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { 
    Notification,
    notificationService,
    userService
  } from '@launchpadapps-au/alpha-shared';
import { NotificationCategory, NotificationSubcategory } from '../common/notificationCategory';
import * as path from 'path';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class PushNotificationHandler {
    private readonly logger = new Logger(PushNotificationHandler.name);

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) {
        const serviceAccount = JSON.parse(Buffer.from(this.envConfigService.firebase.serviceAccountBase64, 'base64').toString()); 
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        this.logger.log('Firebase initialized for messaging');
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
            case NotificationCategory.PROGRESS_MILESTONE:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.THEME_COMPLETED:
                        pushObject.title = '🎉 Congratulations on Your Milestone! 🎉';
                        pushObject.body = `You've completed a level and taken a big step forward! 🌟 Keep growing and reaching your goals. We're cheering you on! 🚀`;
                        break;
                    case NotificationSubcategory.HABIT_COMPLETED:
                        pushObject.title = '🎉 You Did It! 🎉';
                        pushObject.body = `You've successfully completed a habit! 🌟 Keep up the fantastic work and continue growing. We're so proud of you! 🌱`;
                        break;
                    default:
                        Logger.error('Invalid push notification category');
                }
            case NotificationCategory.INACTIVITY_NUDGES:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.INACTIVITY_3DAYS:
                        pushObject.title = 'It can be tricky to stay on track';
                        pushObject.body = `We're here to support you! Let's get back on track together.`;
                        break;
                    default:
                        Logger.error('Invalid push notification category');
                }
                break;
            case NotificationCategory.ENCOURAGEMENT_NOTIFICATION:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.EVERYDAY_REMINDER:
                        pushObject.title = '🌞 Good morning!';
                        pushObject.body = `Dive into today’s cards to continue your health journey. You’re doing great 💪✨`;
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
