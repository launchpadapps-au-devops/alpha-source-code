export const SURVEY_TYPE = {
    'BREAST_CANCER': 'breast_cancer',
    'HEART_RISK': 'heart_risk',
    'DIABETES': 'diabetes',
    'WHO5': 'who5',
} as const;

export enum SurveyTypes {
    BREAST_CANCER = 'breast_cancer',
    HEART_RISK = 'heart_risk',
    DIABETES = 'diabetes',
    WHO5 = 'who5',
    ONBOARDING = 'onboarding',
}

export type SurveyType = typeof SURVEY_TYPE[keyof typeof SURVEY_TYPE];