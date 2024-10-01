import { ApiProperty } from '@nestjs/swagger';

class CategoryDTO {
    @ApiProperty({ example: 2 })
    id: number;

    @ApiProperty({ example: 'Category New Name' })
    name: string;

    @ApiProperty({ example: null, nullable: true })
    image: string | null;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: true })
    isPublished: boolean;

    @ApiProperty({ example: 'Category Description' })
    description: string;

    @ApiProperty({ example: { key: 'value' } })
    metadata: Record<string, unknown>;

    @ApiProperty({ example: '2024-07-04T00:29:32.337Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-07-04T00:29:32.337Z' })
    updatedAt: string;
}


class UserCategoryDTO {
    @ApiProperty({ example: 'f3956f1c-a2a0-4aa7-8b12-62561cb3d778' })
    id: string;

    @ApiProperty({ example: 'dfd13928-b101-416e-ae4d-fc8d403ffb00' })
    userId: string;

    @ApiProperty({ example: 2 })
    categoryId: number;

    @ApiProperty({ example: 'b625ecf9-5e96-4f7a-8393-a15ec625f2c0' })
    userLifestylePlanId: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: false })
    isCompleted: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    completedAt: string | null;

    @ApiProperty({ example: 0 })
    progress: number;

    @ApiProperty({ example: 0 })
    totalReward: number;

    @ApiProperty({ example: 0 })
    totalPoint: number;

    @ApiProperty({ example: 0 })
    totalBadge: number;

    @ApiProperty({ example: '2024-08-04T00:37:18.795Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-08-04T00:37:18.795Z' })
    updatedAt: string;

    @ApiProperty({ type: () => CategoryDTO })
    category: CategoryDTO;
}


class ThemeDTO {
    @ApiProperty({ example: 7 })
    id: number;

    @ApiProperty({ example: 2 })
    themeCode: number;

    @ApiProperty({ example: 3 })
    categoryId: number;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                key: { type: 'string', example: 'value' }
            }
        }
    })
    propertyTags: Array<{ key: string }>;

    @ApiProperty({ example: 'Internal Notes' })
    internalNotes: string;

    @ApiProperty({ example: 'Theme Name 2' })
    name: string;

    @ApiProperty({ example: 'https://sample.com/sample.jpg' })
    image: string;

    @ApiProperty({ example: 'Theme Description' })
    description: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: false })
    isPublished: boolean;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                meta: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string', example: 'value' }
                        }
                    }
                },
                name: { type: 'string', example: 'value 2' },
                order: { type: 'number', example: 2 },
                instructions: { type: 'string', example: 'value' },
                timeAllocation: { type: 'number', example: 1 },
                pointAllocation: { type: 'number', example: 1 }
            }
        }
    })
    habits: Array<{
        meta: Array<{ key: string }>,
        name: string,
        order: number,
        instructions: string,
        timeAllocation: number,
        pointAllocation: number
    }>;

    @ApiProperty({ example: '2024-07-09T01:35:36.941Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-07-29T22:44:14.097Z' })
    updatedAt: string;
}

class UserThemeDTO {
    @ApiProperty({ example: '69994f9d-a1f6-47bf-b076-f584b6643ccc' })
    id: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: 'dfd13928-b101-416e-ae4d-fc8d403ffb00' })
    userId: string;

    @ApiProperty({ example: 'b625ecf9-5e96-4f7a-8393-a15ec625f2c0' })
    userLifestylePlanId: string;

    @ApiProperty({ example: '22d32945-7971-4d9c-9883-9bb4a0816706' })
    userCategoryId: string;

    @ApiProperty({ example: 7 })
    themeId: number;

    @ApiProperty({ example: false })
    isCompleted: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    completedAt: string | null;

    @ApiProperty({ example: 0 })
    progress: number;

    @ApiProperty({ example: 0 })
    totalReward: number;

    @ApiProperty({ example: 0 })
    totalPoint: number;

    @ApiProperty({ example: 0 })
    totalBadge: number;

    @ApiProperty({ example: '2024-08-04T00:37:18.800Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-08-04T00:37:18.800Z' })
    updatedAt: string;

    @ApiProperty({ type: () => ThemeDTO })
    theme: ThemeDTO;
}

class LessonDetailsDTO {
    @ApiProperty({ example: 3 })
    id: number;

    @ApiProperty({ example: 1.1 })
    lessonCode: number;

    @ApiProperty({ example: 7 })
    themeId: number;

    @ApiProperty({ example: 3 })
    categoryId: number;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: false })
    isPublished: boolean;

    @ApiProperty({ example: 20 })
    duration: number;

    @ApiProperty({ example: 5 })
    points: number;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                Prop: { type: 'array', items: { type: 'string', example: 'v1' } }
            }
        }
    })
    lessonTags: Array<{ Prop: string[] }>;

    @ApiProperty({ example: 'Internal Notes' })
    internalNotes: string;

    @ApiProperty({ example: 'Cover Image' })
    coverImage: string;

    @ApiProperty({ example: 'Lesson Name' })
    name: string;

    @ApiProperty({ example: 'Lesson Description' })
    description: string;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                type: { type: 'string', example: 'image' },
                media: { type: 'string', example: 'https://sample.com/sample.jpg' },
                order: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Content' },
                subTitle: { type: 'string', example: 'Sub Title' }
            }
        }
    })
    screenData: Array<{
        type: string,
        media: string,
        order: number,
        content: string,
        subTitle: string
    }>;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                type: { type: 'string', example: 'single-choice' },
                answer: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            option: { type: 'string', example: 'Option 1' },
                            isCorrect: { type: 'boolean', example: true }
                        }
                    }
                },
                options: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            option: { type: 'string', example: 'Option 1' },
                            isCorrect: { type: 'boolean', example: true }
                        }
                    }
                },
                question: { type: 'string', example: 'Question' },
                quizName: { type: 'string', example: 'Quiz Name' },
                userInstructions: { type: 'string', example: 'User Instructions' }
            }
        }
    })
    quizData: Array<{
        type: string,
        answer: Array<{ id: number, option: string, isCorrect: boolean }>,
        options: Array<{ id: number, option: string, isCorrect: boolean }>,
        question: string,
        quizName: string,
        userInstructions: string
    }>;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {},
            example: [{ key: 'This is a free object' }]
        }
    })
    freeTextQuiz: Array<{}>;

    @ApiProperty({ example: '2024-07-09T01:37:01.059Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-07-09T01:37:01.059Z' })
    updatedAt: string;
}

class LessonDTO {
    @ApiProperty({ example: '334846db-89c8-412d-baf8-d853bc7ba9e8' })
    id: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: 'dfd13928-b101-416e-ae4d-fc8d403ffb00' })
    userId: string;

    @ApiProperty({ example: 'b625ecf9-5e96-4f7a-8393-a15ec625f2c0' })
    userLifeStylePlanId: string;

    @ApiProperty({ example: '22d32945-7971-4d9c-9883-9bb4a0816706' })
    userCategoryId: string;

    @ApiProperty({ example: '69994f9d-a1f6-47bf-b076-f584b6643ccc' })
    userThemeId: string;

    @ApiProperty({ example: 3 })
    lessonId: number;

    @ApiProperty({ example: false })
    isCompleted: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    completedAt: string | null;

    @ApiProperty({ example: 0 })
    pointsEarned: number;

    @ApiProperty({ example: 0 })
    quizRetryCount: number;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    quizRetryMeta: string | null;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    feedback: string | null;

    @ApiProperty({ example: false })
    isFeedbackGiven: boolean;

    @ApiProperty({ example: false })
    isPositiveFeedback: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    feedbackDate: string | null;

    @ApiProperty({ example: false })
    isBookmarked: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    bookmarkUpdatedAt: string | null;

    @ApiProperty({ example: '2024-08-04T00:38:34.465Z' })
    updatedAt: string;

    @ApiProperty({ example: '2024-08-04T00:38:34.465Z' })
    createdAt: string;

    @ApiProperty({ type: () => UserThemeDTO })
    userTheme: UserThemeDTO;

    @ApiProperty({ type: () => LessonDetailsDTO })
    lesson: LessonDetailsDTO;

    @ApiProperty({ type: () => UserCategoryDTO })
    userCategory: UserCategoryDTO; // Include UserCategoryDTO here
}


export class GetUserDailyLessonResponseDTO {
    @ApiProperty({ type: [LessonDTO] })
    data: LessonDTO[];

    @ApiProperty({ example: 'User lifestyle plan fetched successfully' })
    message: string;

    @ApiProperty({ example: {} })
    meta: object;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
