export const MICROSERVICE_NAMES = {
    CMS: 'cms-ms',
    GOALS_ACTIVITY: 'goals-activity-ms',
    HEALTH: 'health-ms',
    NOTIFICATION: 'notification-ms',
    USER: 'user-ms'
} as const;

export type MicroserviceName = typeof MICROSERVICE_NAMES[keyof typeof MICROSERVICE_NAMES];