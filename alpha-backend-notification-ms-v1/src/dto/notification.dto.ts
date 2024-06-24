import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class NotificationCategory {
    @IsString()
    name: string;

    @IsString()
    description: string;
}

export class NotificationSubcategory {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    categoryId: number;
}

export class NotificationDto {
    @IsNumber()
    @Type(() => Number)
    userId: number;

    @IsString()
    @IsOptional()
    @IsEnum(['sms', 'push', 'email'])
    type: string = 'email';

    @IsNumber()
    @IsOptional()
    category: number;

    @IsNumber()
    @IsOptional()
    subcategory: number;

    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    templateId: number;

    @IsString()
    @IsOptional()
    customTemplate: string;

    @IsString()
    @IsOptional()
    data: string;

    @IsString()
    @IsOptional()
    metadata: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    proccessed: boolean = false;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isScheduled: boolean;

    @IsString()
    @Type(() => Date)
    scheduletime: Date;

    @IsString()
    @IsOptional()
    @Type(() => Date)
    seenAt: Date;
}

export class NotificationTemplateDto {
    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsString()
    type: string;

    @IsNumber()
    category: string;

    @IsNumber()
    subcategory: string;

    @IsString()
    @IsOptional()
    metadata: string;
}