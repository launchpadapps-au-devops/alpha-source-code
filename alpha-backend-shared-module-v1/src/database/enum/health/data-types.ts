export const DATA_TYPES = {
    'STEP_COUNT': 'step_count',
    'DISTANCE': 'distance',
    'CALORIES': 'calories',
    'SLEEP': 'sleep',
    'HEART_RATE': 'heart_rate',
    'MOVE_MINUTES': 'move_minutes'
}

export enum DataTypes {
    STEP_COUNT = 'step_count',
    DISTANCE = 'distance',
    CALORIES = 'calories',
    SLEEP = 'sleep',
    HEART_RATE = 'heart_rate',
    MOVE_MINUTES = 'move_minutes'
}

export type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES];