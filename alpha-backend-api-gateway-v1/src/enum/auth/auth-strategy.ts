export const AUTH_STRATEGIES = {
    PATIENT: 'patient',
    PERMISSION_BASED: 'permission based'
} as const;

export type AuthStrategy = typeof AUTH_STRATEGIES[keyof typeof AUTH_STRATEGIES];