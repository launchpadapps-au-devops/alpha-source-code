import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { User } from '@launchpadapps-au/alpha-shared';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export class CreateCategoryDto {
    @ApiProperty({ example: 'Category Name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://sample.com/sample.jpg', required: false})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ example: 'Category Status', enum: ['ACTIVE', 'ARCHIVE'], required: false})
    @IsOptional()
    @IsString()
    status?: string = 'ACTIVE';

    @ApiProperty({  example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean = true;

    @ApiProperty({ example: 'Category Description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: { key: 'value' }, required: false })
    @IsOptional()
    metadata?: object;
}

export class UpdateCategoryDto extends CreateCategoryDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;
}

export class bulkUpdateCategoryDto {
    @ApiProperty({ type: [CreateCategoryDto] })
    @Type(() => CreateCategoryDto)
    categories: CreateCategoryDto[];
}

export class CategoryResponseDto extends CreateCategoryDto {
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
    createdBy: User;

    @ApiProperty({ example: 'userId' })
    updatedBy: User;
}
