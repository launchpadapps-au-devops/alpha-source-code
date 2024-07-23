import { ApiProperty } from '@nestjs/swagger';


class ThemeDTO {
    @ApiProperty({ example: 9 })
    id: number;

    @ApiProperty({ example: 3 })
    themeCode: number;

    @ApiProperty({ example: 2 })
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

    @ApiProperty({ example: 'Theme Name 3' })
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
                name: { type: 'string', example: 'value' },
                order: { type: 'number', example: 1 },
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

    @ApiProperty({ example: '2024-07-09T01:42:38.898Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-07-09T01:42:38.898Z' })
    updatedAt: string;
}

class UserThemeDTO {
    @ApiProperty({ example: '0c1c29ab-2943-42ff-90fe-034010ac7c7c' })
    id: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: 'dfd13928-b101-416e-ae4d-fc8d403ffb00' })
    userId: string;

    @ApiProperty({ example: '0735ff70-f02f-4985-80ad-7c9f5cff68eb' })
    userLifestylePlanId: string;

    @ApiProperty({ example: 9 })
    themeId: number;

    @ApiProperty({ example: false })
    isCompleted: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    completedAt: string | null;

    @ApiProperty({ example: 0 })
    progress: number;

    @ApiProperty({ example: '2024-07-19T19:37:40.224Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-07-19T19:37:40.224Z' })
    updatedAt: string;

    @ApiProperty({ type: () => ThemeDTO })
    theme: ThemeDTO;
}

class LessonDetailsDTO {
    @ApiProperty({ example: 5 })
    id: number;

    @ApiProperty({ example: 1.2 })
    lessonCode: number;

    @ApiProperty({ example: 9 })
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

    @ApiProperty({ example: '2024-07-09T01:37:19.910Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-07-09T02:45:34.691Z' })
    updatedAt: string;
}

class LessonDTO {
    @ApiProperty({ example: 'a1312181-b6b6-47e1-ad2e-d43e203c6d3b' })
    id: string;

    @ApiProperty({ example: 'ACTIVE' })
    status: string;

    @ApiProperty({ example: 'dfd13928-b101-416e-ae4d-fc8d403ffb00' })
    userId: string;

    @ApiProperty({ example: '0c1c29ab-2943-42ff-90fe-034010ac7c7c' })
    userThemeId: string;

    @ApiProperty({ example: 5 })
    lessonId: number;

    @ApiProperty({ example: false })
    isCompleted: boolean;

    @ApiProperty({ example: null, type: 'string', nullable: true })
    completedAt: string | null;

    @ApiProperty({ example: null, type: 'number', nullable: true })
    pointsEarned: number | null;

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

    @ApiProperty({ example: '2024-07-22T04:48:35.553Z' })
    updatedAt: string;

    @ApiProperty({ example: '2024-07-22T04:48:35.553Z' })
    createdAt: string;

    @ApiProperty({ type: () => UserThemeDTO })
    userTheme: UserThemeDTO;

    @ApiProperty({ type: () => LessonDetailsDTO })
    lesson: LessonDetailsDTO;
}

export class GetUserDailyLessonResponseDTO {
    @ApiProperty({ type: [LessonDTO] })
    data: LessonDTO[];

    @ApiProperty({ example: 'User daily lesson fetched successfully' })
    message: string;

    @ApiProperty({ example: {} })
    meta: object;

    @ApiProperty({ example: 200 })
    statusCode: number;
}

export class GetUserDailyLessonResponseWrapperDTO {
    @ApiProperty({ type: GetUserDailyLessonResponseDTO })
    data: GetUserDailyLessonResponseDTO;

    @ApiProperty({ example: 'User daily lesson fetched successfully' })
    message: string;

    @ApiProperty({ example: {} })
    meta: object;

    @ApiProperty({ example: 200 })
    statusCode: number;
}
