export const DATA_UNITS = {
    'COUNT': 'count',
    'DISTANCE': 'distance',
    'CALORIES': 'calories',
} as const;

export enum DataUnits {
    COUNT = 'count',
    DISTANCE = 'distance',
    CALORIES = 'calories',
}

export type DataUnit = typeof DATA_UNITS[keyof typeof DATA_UNITS];