export const POLICY_TYPES = {
    PRIVACY_POLICY: 'privacy_policy',
    TERMS_AND_CONDITIONS: 'terms_conditions',
    DATA_CONSENT: 'data_consent',
} as const;

export type PolicyType = typeof POLICY_TYPES[keyof typeof POLICY_TYPES];