export const DATA_SOURCES = {
    GOOGLE_FIT: 'google_fit',
    APPLE_HEALTH: 'apple_health',
} as const;

export enum DataSources {
    GOOGLE_FIT = 'google_fit',
    APPLE_HEALTH = 'apple_health',
}

export type DataSource = typeof DATA_SOURCES[keyof typeof DATA_SOURCES];