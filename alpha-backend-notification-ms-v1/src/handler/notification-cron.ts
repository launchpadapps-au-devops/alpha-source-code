import { notificationService, NotificationType, sessionService, userLessonService, userService } from '@launchpadapps-au/alpha-shared';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationCategory, NotificationSubcategory } from 'src/common/notificationCategory';

@Injectable()
export class NotificationCron {
    constructor() { }

    /**
     * Notifcation Subcategory -> 
     * Send notification to users who have not logged in for 3 day
     */
    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async sendNotificationForInactivityIn3Days() {
        try {
            const users = await userService.find({ where: { lastLoginAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000) } });
            if (!users.length) return;

            const { data: userNotifications } = await notificationService.findAllNotification(
                {},
                { sortField: 'createdAt', sortOrder: 'DESC' },
                {
                    categoryId: NotificationCategory.INACTIVITY_NUDGES,
                    subcategoryId: NotificationSubcategory.INACTIVITY_3DAYS,
                    fromDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
                    toDate: new Date(),
                }
            );

            const notificationToSend = [];
            for(const user of users) {
                const notification = userNotifications.find(({ userId }) => userId === user.id);
                if (notification) continue;

                notificationToSend.push({
                    userId: user.id,
                    recipients: [user.id],
                    type: NotificationType.EMAIL,
                    data: { firstName: user.firstName },
                    categoryId: NotificationCategory.INACTIVITY_NUDGES,
                    subcategoryId: NotificationSubcategory.INACTIVITY_3DAYS,
                });
            }

            await notificationService.addUpdateBulkNotification(notificationToSend);
        } catch (error) {
            Logger.error('Error in Sending Notification For Inactivity', error);
        }
    }

    /**
     * Notifcation Subcategory -> THIRD_INACTIVITY
     * Send notification to users who have got 3 InApp inactivity notifications
     */
    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async sendNotificationForThirdInactivity() {
        try {
            const { data: notifications } = await notificationService.findAllNotification(
                {},
                { sortField: 'createdAt', sortOrder: 'DESC' },
                {
                    seenAt: null,
                    processed: false,
                    categoryId: NotificationCategory.INACTIVITY_NUDGES,
                    subcategoryId: NotificationSubcategory.INACTIVITY_3DAYS,
                }
            );
    
            const userNotifications = notifications.reduce(
                (acc, { userId, id }) => (acc[userId] = (acc[userId] || []).concat(id), acc),
                {} as Record<string, number[]>
            );
    
            const eligibleUserIds = Object.keys(userNotifications).filter(userId => userNotifications[userId].length >= 3);
            if (!eligibleUserIds.length) return;
    
            // Prepare notifications for eligible users
            const users = await userService.findUsersByIds(eligibleUserIds);
            const notificationsToSend = users.map(user => ({
                userId: user.id,
                recipients: [user.id],
                type: NotificationType.EMAIL,
                data: { firstName: user.firstName },
                categoryId: NotificationCategory.ENGAGEMENT_LEVEL_ALERT,
                subcategoryId: NotificationSubcategory.THIRD_INACTIVITY,
            })) as any;
    
            // Send notifications
            await notificationService.addUpdateBulkNotification(notificationsToSend);
    
            // Mark notifications as reminded
            const notificationIdsToUpdate = eligibleUserIds.flatMap(userId => userNotifications[userId]);
            const updateNotifications = notificationIdsToUpdate.map(id => ({ id, isReminded: true })) as any;
    
            await notificationService.addUpdateBulkNotification(updateNotifications);
        } catch (error) {
            Logger.error('Error in Sending Notification For Third Inactivity', error);
        }
    }

    /**
     * Notifcation Subcategory -> DOCTOR_APPOINTMENT_REMINDER
     * Send notification to users for doctor appointment reminder if passwordResetAt is greater than 2 weeks
     */
    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async sendDoctorAppointmentReminder() {
        try {
            const users = await userService.findUserBetweenDates(
                null,
                null,
                'passwordResetAt',
                new Date(new Date().getTime() - 2 * 7 * 24 * 60 * 60 * 1000),
            );
    
            if (!users.length) return;
    
            const userIds = users.map(user => user.id);
            const { data: notifications } = await notificationService.findAllNotification(
                {},
                { sortField: 'createdAt', sortOrder: 'DESC' },
                {
                    categoryId: NotificationCategory.ENGAGEMENT_LEVEL_ALERT,
                    subcategoryId: NotificationSubcategory.DOCTOR_APPOINTMENT_REMINDER,
                    userIds,
                }
            );
    
            const notificationToSend = [];
            for(const user of users) {
                const notification = notifications.find(({ userId }) => userId === user.id);
                if (notification) continue;
    
                notificationToSend.push({
                    userId: user.id,
                    recipients: [user.id],
                    type: NotificationType.EMAIL,
                    data: { firstName: user.firstName },
                    categoryId: NotificationCategory.ENGAGEMENT_LEVEL_ALERT,
                    subcategoryId: NotificationSubcategory.DOCTOR_APPOINTMENT_REMINDER,
                });
            }
    
            if (!notificationToSend.length) return;
    
            await notificationService.addUpdateBulkNotification(notificationToSend);
        } catch (error) {
            Logger.error('Error in Sending Doctor Appointment Reminder', error);
        }
    }

    /**
     * Notifcation Subcategory -> Not Started
     * Send notification to users who have not started user lesson in 3 days
     */
    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async sendNotStartedNotification() {
        try {
            const users = await userService.findUserBetweenDates(
                null,
                null,
                'passwordResetAt',
                new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
            );
    
            if (!users.length) return;

            const userIds = users.map(user => user.id);
            const userLessonLogs = await userLessonService.findUserLessonBetweenDates(
                'completedAt',
                new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
                'completedAt',
                new Date(),
                userIds
            );

            const notificationToSend = [];
            for(const user of users) {
                const userLessonLog = userLessonLogs.find(({ userId }) => userId === user.id);
                if (userLessonLog) continue;

                notificationToSend.push({
                    userId: user.id,
                    recipients: [user.id],
                    type: NotificationType.EMAIL,
                    data: { firstName: user.firstName },
                    categoryId: NotificationCategory.INACTIVITY_NUDGES,
                    subcategoryId: NotificationSubcategory.NOT_STARTED,
                });
            }

            if (!notificationToSend.length) return;
            await notificationService.addUpdateBulkNotification(notificationToSend);
        } catch (error) {
            Logger.error('Error in Sending Not Started Notification', error);
        }
    }

    /**
     * Notifcation Subcategory -> Everyday Reminder
     * Send notification to users for everyday reminder
     */
    @Cron(CronExpression.EVERY_DAY_AT_11AM)
    async sendEverydayReminder() {
        try {
            const users = await userService.find({ where: { lastLoginAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000) } });
            if (!users.length) return;

            const { data: userNotifications } = await notificationService.findAllNotification(
                {},
                { sortField: 'createdAt', sortOrder: 'DESC' },
                {
                    categoryId: NotificationCategory.ENCOURAGEMENT_NOTIFICATION,
                    subcategoryId: NotificationSubcategory.EVERYDAY_REMINDER,
                    fromDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
                    toDate: new Date(),
                }
            );

            const notificationToSend = [];
            for(const user of users) {
                const notification = userNotifications.find(({ userId }) => userId === user.id);
                if (notification) continue;

                notificationToSend.push({
                    userId: user.id,
                    recipients: [user.id],
                    type: NotificationType.PUSH,
                    data: { firstName: user.firstName },
                    categoryId: NotificationCategory.ENCOURAGEMENT_NOTIFICATION,
                    subcategoryId: NotificationSubcategory.EVERYDAY_REMINDER,
                });
            }

            await notificationService.addUpdateBulkNotification(notificationToSend);
        } catch (error) {
            Logger.error('Error in Sending Everyday Reminder', error);
        }
    }
}