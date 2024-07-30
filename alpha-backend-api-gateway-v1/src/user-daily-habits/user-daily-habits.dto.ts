import { ApiProperty } from '@nestjs/swagger';

export class ThemeDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Health' })
  name: string;

  @ApiProperty({ example: 'A theme related to health and wellness.' })
  description: string;

  @ApiProperty({ example: '2024-07-29T12:34:56Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-29T12:34:56Z' })
  updatedAt: Date;
}

export class HabitDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  themeId: number;

  @ApiProperty({ type: ThemeDto })
  theme: ThemeDto;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 'Exercise' })
  name: string;

  @ApiProperty({ example: 30 })
  timeAllocation: number;

  @ApiProperty({ example: 10 })
  pointAllocation: number;

  @ApiProperty({ example: 'Do 30 minutes of exercise' })
  instructions: string;

  @ApiProperty({ example: { difficulty: 'medium' } })
  meta: object;

  @ApiProperty({ example: '2024-07-29T12:34:56Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-29T12:34:56Z' })
  updatedAt: Date;
}

export class UserHabitResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  userThemeId: string;

  @ApiProperty({ type: HabitDto })
  habit: HabitDto;

  @ApiProperty({ example: false })
  isCompleted: boolean;

  @ApiProperty({ example: '2024-07-29T12:34:56Z', nullable: true })
  completedAt: Date;

  @ApiProperty({ example: '2024-07-29T12:34:56Z', nullable: true })
  startedAt: Date;

  @ApiProperty({ example: '2024-07-29T12:34:56Z', nullable: true })
  targetDate: Date;

  @ApiProperty({ example: 10 })
  pointsEarned: number;

  @ApiProperty({ example: '2024-07-29T12:34:56Z' })
  updatedAt: Date;

  @ApiProperty({ example: '2024-07-29T12:34:56Z' })
  createdAt: Date;
}
