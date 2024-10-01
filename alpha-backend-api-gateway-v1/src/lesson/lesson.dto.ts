import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateLessonDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    lessonCode?: number;

    @ApiProperty({ example: 1, required: false})
    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @ApiProperty({ example: 1, required: false})
    @IsNumber()
    @IsOptional()
    themeId?: number;

    @ApiProperty({ example: 'ACTIVE', required: false})
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ example: false, required: false})
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean = false;

    @ApiProperty({ example: 10, required: false})
    @IsNumber()
    @IsOptional()
    duration?: number;

    @ApiProperty({ example: 20, required: false})
    @IsNumber()
    @IsOptional()
    points?: number;

    @ApiProperty({ example: [{ 'Prop': [ 'v1', 'v2'] }], required: false })
    @IsOptional()
    lessonTags?: object [];

    @ApiProperty({ example: 'Internal Notes', required: false })
    @IsOptional()
    @IsString()
    internalNotes?: string;

    @ApiProperty({ example: 'Cover Image', required: false })
    @IsOptional()
    @IsString()
    coverImage?: string;

    @ApiProperty({ example: 'Lesson Name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Lesson Description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: [{ 
        'order': 1,
        'media': 'https://sample.com/sample.jpg',
        'type': 'image',
        'subTitle': 'Sub Title',
        'content': 'Content',
     }], required: false })
    @IsOptional()
    screenData?: object;

    @ApiProperty({ example: [{ 
        'quizName': 'Quiz Name',
        'userInstructions': 'User Instructions',
        'question': 'Question',
        'type': 'single-choice',
        'options': [
            { 'option': 'Option 1', 'isCorrect': true, id: 1 },
            { 'option': 'Option 2', 'isCorrect': false, id: 2 },
            { 'option': 'Option 3', 'isCorrect': false, id: 3 },
            { 'option': 'Option 4', 'isCorrect': false, id: 4 },
        ],
        'answer': [
            { 'option': 'Option 1', 'isCorrect': true, id: 1 }
        ],
     }], required: false })
    @IsOptional()
    quizData?: object;

    @ApiProperty({ example: [{}] })
    @IsOptional()
    freeTextQuiz?: object;
}

export class UpdateLessonDto extends CreateLessonDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;
}

export class LessonResponseDto extends CreateLessonDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
    @IsDateString()
    createdAt: Date;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
    @IsDateString()
    updatedAt: Date;

    @ApiProperty({ example: 'userId' })
    @IsString()
    createdBy: string;

    @ApiProperty({ example: 'userId' })
    @IsString()
    updatedBy: string;
}