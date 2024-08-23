export const DATA_UNITS = {
    'COUNT': 'COUNT',
    'DISTANCE': 'distance',
    'CALORIES': 'KILOCALORIE',
} as const;

export enum DataUnits {
    COUNT = 'COUNT',
    DISTANCE = 'distance',
    CALORIES = 'KILOCALORIE',
}

export type DataUnit = typeof DATA_UNITS[keyof typeof DATA_UNITS];