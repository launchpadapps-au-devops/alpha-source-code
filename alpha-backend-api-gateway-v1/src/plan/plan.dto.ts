import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { User, Plan, Theme } from '@launchpadapps-au/alpha-shared';
import { ThemeResponseDto } from 'src/theme/theme.dto';

export class CreatePlanDto {
    @ApiProperty({ example: 1, description: 'Plan Code' })
    @IsNumber()
    planCode: number;

    @ApiProperty({ example: 'Plan Name', description: 'Plan Name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://sample.com/sample.jpg', required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ example: 'Plan Description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'Internal Notes', required: false })
    @IsOptional()
    @IsString()
    internalNotes?: string;

    @ApiProperty({ enum: ['ACTIVE', 'DRAFT', 'ARCHIVE'], example: 'ACTIVE' })
    @IsEnum(['ACTIVE', 'DRAFT', 'ARCHIVE'])
    status: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isPublished: boolean = false;ß
}

export class UpdatePlanDto extends CreatePlanDto {
    @ApiProperty({ example: 1, description: 'Plan ID' })
    @IsNumber()
    id: number;
}

export class PlanResponseDto extends CreatePlanDto {
    @ApiProperty({ example: [] })
    themes: ThemeResponseDto[];

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