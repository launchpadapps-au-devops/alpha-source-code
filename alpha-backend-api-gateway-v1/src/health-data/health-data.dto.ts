import { ApiProperty } from '@nestjs/swagger';

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
