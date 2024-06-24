export const PERMISSION_NAMES = {
    SUPER_ADMIN: 'super admin',
    CARE_TEAM_MEMBER: 'care_team_member'
} as const;

export type PermissionName = typeof PERMISSION_NAMES[keyof typeof PERMISSION_NAMES];