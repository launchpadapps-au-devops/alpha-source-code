export const NotificationCategory = {
    ACCOUNT_INVITATION: 1,
    ACCOUNT_AUTH: 2,
}

export const NotificationSubcategory = {
    // Account Invitation
    PATIENT_INVITATION: 1,
    STAFF_INVITATION: 3,

    // Account Auth
    FORGOT_PASSWORD_OTP: 2,
}

export const NotificationPreferenceInit = [
    { category: 1, subCategory: [1, 3] }
]
