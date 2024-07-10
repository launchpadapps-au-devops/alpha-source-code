import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import emailTemplate from './templates';
import { 
    Notification,
    notificationService,
    userService
  } from '@launchpadapps-au/alpha-shared';
import { NotificationCategory, NotificationSubcategory } from './notificationCategory';

@Injectable()
export class EmailHandler {
    constructor(
        protected readonly configService: ConfigService,
    ) {
        sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    }

    async handle(notificationData: Notification): Promise<void> {
        try {
            const emailData = this.getEmailData(notificationData);
            const htmlContent = handlebars.compile(emailData.template)(emailData.templateData);
     
            const { to, cc, bcc } = await this.getRecipient(notificationData.recipients || [], notificationData.cc || [], notificationData.bcc || []);

            await this.sendEmail(to, emailData.subject, htmlContent, cc, bcc);
            this.updateNotificationStatus(notificationData.id, true);  
        } catch (error) {
            Logger.error('Error sending email:', error);
            this.updateNotificationStatus(notificationData.id, false, error.message);
        }
    }

    protected getEmailData(notificationData: Notification): { recipient: string[]; template: string; subject: string; templateData: object } {
        const emailObject = {
            subject: '',
            recipient: notificationData.recipients,
            template: '',
            templateData: notificationData.data
        };
        
        switch (notificationData.categoryId) {

            case NotificationCategory.ACCOUNT_INVITATION:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.PATIENT_INVITATION:
                        emailObject.subject = 'You are invited on Alpha';
                        emailObject.template = emailTemplate[NotificationSubcategory.PATIENT_INVITATION]
                        break;
                    case NotificationSubcategory.STAFF_INVITATION:
                        emailObject.subject = 'You are invited on Alpha';
                        emailObject.template = emailTemplate[NotificationSubcategory.STAFF_INVITATION]
                        break;
                    default:
                        Logger.error('Invalid email category');
                }
                break;
            case NotificationCategory.ACCOUNT_AUTH:
                switch (notificationData.subcategoryId) {
                    case NotificationSubcategory.FORGOT_PASSWORD_OTP:
                        emailObject.subject = 'Reset your password';
                        emailObject.template = emailTemplate[NotificationSubcategory.FORGOT_PASSWORD_OTP]
                        break;
                    default:
                        Logger.error('Invalid email category');
                }
                break;
            default:
                Logger.error('Invalid email category');
        }

        return emailObject;
    }

    protected async getRecipient(
        recipient = [],
        cc = [],
        bcc = []
    ): Promise<{ to: string; cc: string; bcc: string }> {
       const users = await userService.findUsersByIds([ ...recipient, ...cc, ...bcc]);
         
        const to = users.filter(user => recipient.includes(user.id));
        cc = users.filter(user => cc.includes(user.id));
        bcc = users.filter(user => bcc.includes(user.id));

            return {
                to: to.map(user => user.email).join(','),
                cc: cc.map(user => user.email).join(','),
                bcc: bcc.map(user => user.email).join(','),
            };
       
    }

    protected async sendEmail(to: string, subject: string, htmlContent: string, cc: string = '', bcc: string = ''): Promise<void> {
        const msg = {
            to,
            cc,
            bcc,
            from: {
                name: this.configService.get<string>('SENDGRID_FROM_NAME'),
                email: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
            },
            subject,
            html: htmlContent,
            clickTracking: {
                enable: false,
            },
        };

        try {
            await sgMail.send(msg);
            Logger.log('Email sent successfully');
        } catch (error) {
            Logger.error('Error sending email:', error);
            throw new Error('Email sending failed');
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
