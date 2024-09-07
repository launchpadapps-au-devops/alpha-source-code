export const NotificationCategory = {
    ACCOUNT_INVITATION: 1,
    ACCOUNT_AUTH: 2,
    ACTIVITY: 3,
    ENGAGEMENT_LEVEL_ALERT: 4,
    PROGRESS_MILESTONE: 5,
    INACTIVITY_NUDGES: 6,
    ENCOURAGEMENT_NOTIFICATION: 7,
}

export const NotificationSubcategory = {
    // Account Invitation
    PATIENT_INVITATION: 1,         // TYPE: Email // Welcome
    STAFF_INVITATION: 3,

    // Account Auth
    FORGOT_PASSWORD_OTP: 2,         // TYPE: Email // Forgot Password
    PASSWORD_CHANGED: 5,            // TYPE: Email // Password Successfully Changed

    // Engagement Level Alert
    THIRD_INACTIVITY: 14,               // TYPE: Email
    DOCTOR_APPOINTMENT_REMINDER: 15,    // TYPE: Email

    // Progress Milestone
    THEME_COMPLETED: 16,                // TYPE: PUSH  // Milestone
    HABIT_COMPLETED: 17,                // TYPE: PUSH  // Milestone

    // Inactivity Nudges
    INACTIVITY_3DAYS: 18,           // TYPE: PUSH  // Inactivity
    NOT_STARTED: 19,                // TYPE: Email // Not Started

    // Encourgament Notification
    EVERYDAY_REMINDER: 20,          // TYPE: PUSH  // Everyday Reminder
}

export const NotificationPreferenceInit = [
    { category: NotificationCategory.ENGAGEMENT_LEVEL_ALERT, subCategory: [ NotificationSubcategory.THIRD_INACTIVITY, NotificationSubcategory.DOCTOR_APPOINTMENT_REMINDER ] },
    { category: NotificationCategory.PROGRESS_MILESTONE, subCategory: [ NotificationSubcategory.THEME_COMPLETED, NotificationSubcategory.HABIT_COMPLETED ] },
    { category: NotificationCategory.INACTIVITY_NUDGES, subCategory: [ NotificationSubcategory.INACTIVITY_3DAYS, NotificationSubcategory.NOT_STARTED ] },
    { category: NotificationCategory.ENCOURAGEMENT_NOTIFICATION, subCategory: [ NotificationSubcategory.EVERYDAY_REMINDER ] },
]
