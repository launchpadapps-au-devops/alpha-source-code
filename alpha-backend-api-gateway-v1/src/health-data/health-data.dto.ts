import { SURVEY_TYPE, SurveyTypes } from '@launchpadapps-au/alpha-shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsDate, IsObject } from 'class-validator';

export class CreateHealthProfileQuestionariesDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user-id-123' })
  userId: string;

  @ApiProperty({ example: 'v1' })
  questionVersion: string;

  @ApiProperty({ example: 'v1' })
  answerVersion: string;

  @ApiProperty({ enum: ['ACTIVE', 'ARCHIVE'], example: 'ACTIVE'})
  status: string;

  @ApiProperty({ example: 'What is your health goal?' })
  question: string;

  @ApiProperty({ example: 'text' })
  questionType: string;

  @ApiProperty({ example: 'health' })
  questionTag: string;

  @ApiProperty({ example: 'general' })
  questionCategory: string;

  @ApiProperty({ example: 'sub-category-example' })
  questionSubCategory: string;

  @ApiProperty({ example: 'text' })
  answerInputType: string;

  @ApiProperty({ example: '["option1", "option2"]' })
  answerOptions: string;

  @ApiProperty({ example: {} })
  answer: object;

  @ApiProperty({ example: 'general, health' })
  answerTags: string;

  @ApiProperty({ example: 'general' })
  answerCategory: string;

  @ApiProperty({ example: 'sub-category-example' })
  answerSubCategory: string;
}

export class GetHealthProfileQuestionariesDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user-id-123' })
  userId: string;

  @ApiProperty({ example: 'v1' })
  questionVersion: string;

  @ApiProperty({ example: 'v1' })
  answerVersion: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 'What is your health goal?' })
  question: string;

  @ApiProperty({ example: 'text' })
  questionType: string;

  @ApiProperty({ example: 'health' })
  questionTag: string;

  @ApiProperty({ example: 'general' })
  questionCategory: string;

  @ApiProperty({ example: 'sub-category-example' })
  questionSubCategory: string;

  @ApiProperty({ example: 'text' })
  answerInputType: string;

  @ApiProperty({ example: '["option1", "option2"]' })
  answerOptions: string;

  @ApiProperty({ example: {} })
  answer: object;

  @ApiProperty({ example: 'general, health' })
  answerTags: string;

  @ApiProperty({ example: 'general' })
  answerCategory: string;

  @ApiProperty({ example: 'sub-category-example' })
  answerSubCategory: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @ApiProperty({ example: 'user-id-123' })
  createdBy: string;

  @ApiProperty({ example: 'user-id-123' })
  updatedBy: string;
}

export class CreateSurveyAnswerDto extends CreateHealthProfileQuestionariesDto {
  @ApiProperty({ enum: SurveyTypes, example: SURVEY_TYPE.BREAST_CANCER })
  surveyType: string;
}

export class GetSurveyAnswerDto extends GetHealthProfileQuestionariesDto {
  @ApiProperty({ enum: SurveyTypes, example: SURVEY_TYPE.BREAST_CANCER })
  surveyType: string;
}

import { DataSources, DataTypes } from '@launchpadapps-au/alpha-shared';

export class CreateUserHealthDataDto {
    
    @ApiProperty({ example: 'e7b4d99b-ecf1-46f9-a14f-3fbd0a2f2a74', description: 'UUID of the user' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: DataSources.GOOGLE_FIT, enum: DataSources, description: 'Source of the health data' })
    @IsEnum(DataSources)
    @IsNotEmpty()
    source: DataSources;

    @ApiProperty({ example: DataTypes.HEART_RATE, enum: DataTypes, description: 'Type of health data' })
    @IsEnum(DataTypes)
    @IsNotEmpty()
    dataType: DataTypes;

    @ApiPropertyOptional({ example: 72.5, description: 'Value of the health data' })
    @IsOptional()
    @IsNumber()
    value?: number;

    @ApiPropertyOptional({ example: 'bpm', description: 'Unit of the health data value' })
    @IsOptional()
    @IsString()
    unit?: string;

    @ApiPropertyOptional({ example: '2024-08-14T09:27:00Z', description: 'Timestamp when the data was logged' })
    @IsOptional()
    @IsDate()
    loggedAt?: Date;

    @ApiPropertyOptional({ example: { sourceDevice: 'Fitbit' }, description: 'Additional metadata as a JSON object' })
    @IsOptional()
    @IsObject()
    meta?: object;
}

export class GetUserHealthDataDto extends CreateUserHealthDataDto {
    @ApiProperty({ example: new Date().toISOString(), description: 'Timestamp when the data was created' })
    createdAt: Date;

    @ApiProperty({ example: new Date().toISOString(), description: 'Timestamp when the data was last updated' })
    updatedAt: Date;

    @ApiProperty({ example: 'e7b4d99b-ecf1-46f9-a14f-3fbd0a2f2a74', description: 'UUID of the user who created the data' })
    createdBy: string;

    @ApiProperty({ example: 'e7b4d99b-ecf1-46f9-a14f-3fbd0a2f2a74', description: 'UUID of the user who last updated the data' })
    updatedBy: string;
}
