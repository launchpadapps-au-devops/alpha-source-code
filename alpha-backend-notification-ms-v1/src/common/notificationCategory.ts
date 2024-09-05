export const NotificationCategory = {
    ACCOUNT_INVITATION: 1,
    ACCOUNT_AUTH: 2,
    ACTIVITY: 3,
    ENGAGEMENT: 4,
}

export const NotificationSubcategory = {
    // Account Invitation
    PATIENT_INVITATION: 1,         // TYPE: Email // Welcome
    STAFF_INVITATION: 3,

    // Account Auth
    FORGOT_PASSWORD_OTP: 2,         // TYPE: Email // Forgot Password
    PASSWORD_CHANGED: 5,            // TYPE: Email // Password Successfully Changed

    // ACTIVITY
    PATIENT_INACTIVITY: 7,          // TYPE: PUSH  // Inactivity
    PATIENT_NOT_STARTED: 8,         // TYPE: Email // Not Started
    PATIENT_THEME_MILESTONE: 9,     // TYPE: PUSH  // Milestone
    PATIENT_HABIT_EXPIRY: 10,       // TYPE: PUSH  // Milestone

    // ENGAGEMENT
    PATIENT_EVERYDAY_REMINDER: 11,      // TYPE: PUSH  // Everyday Reminder
    PATIENT_NOTIFICATION_IGNORE: 12,    // TYPE: Email // Re-engagement email targeted to hook interest of user
    PATIENT_APPOINTMENT_REMINDER: 13,   // TYPE: Email // Appointment reminder email
}

export const NotificationPreferenceInit = [
    { category: 1, subCategory: [1, 3] }
]
