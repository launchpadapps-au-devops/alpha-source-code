export const ROLE_NAMES = {
    NURSE: 'nurse',
    MPA: 'mpa',
    CONTENT_CREATOR: 'content creator',
    GP: 'gp'
} as const;

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];