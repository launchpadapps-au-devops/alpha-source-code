import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { User } from '@launchpadapps-au/alpha-shared';
import { Lesson } from '@launchpadapps-au/alpha-shared/dist/database/entities/lesson.entity';

export class CreateThemeDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    themeCode: number;

    @ApiProperty({ example: 'categoryId' })
    @IsString()
    categoryId: number;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isPublished: boolean = false;

    @ApiProperty({ example: 'Internal Notes', required: false })
    @IsOptional()
    @IsString()
    internalNotes?: string;

    @ApiProperty({ example: 'Theme Name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://sample.com/sample.jpg', required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ example: 'Theme Description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: [{ 'key': 'value' }], required: false })
    @IsOptional()
    propertyTags?: object;
    @ApiProperty({
        example: [{
            order: 1,
            name: 'value',
            timeAllocation: 1,
            pointAllocation: 1,
            instructions: 'value',
            meta: [{ key: 'value' }]
        }]
    })
    @IsOptional()
    habits: object;
}

export class UpdateThemeDto extends CreateThemeDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;
}

export class bulkUpdateThemeDto {
    @ApiProperty({ type: [CreateThemeDto] })
    @Type(() => CreateThemeDto)
    themes: CreateThemeDto[];
}

export class ThemeResponseDto extends CreateThemeDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: {
            lessons: [{
                id: 1,
                name: 'value'
            }]
        }
    })
    @Type(() => Lesson)
    lessons: Lesson[];

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