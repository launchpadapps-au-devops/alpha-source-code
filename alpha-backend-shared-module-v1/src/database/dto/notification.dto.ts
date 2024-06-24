import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../entities/notification.entity";

export class NotificationCategoryDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    id: number;

    @IsString()
    name: string;

    @IsString()
    description: string;
}

export class NotificationSubcategoryDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    id: number;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    categoryId: number;
}

export class NotificationDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    id: number;

    @IsNumber()
    @Type(() => Number)
    userId: number;

    @IsString()
    @IsOptional()
    @IsEnum(NotificationType)
    @Type(() => String)
    type: string = NotificationType.EMAIL;

    @IsNumber()
    @IsOptional()
    categoryId: number;

    @IsNumber()
    @IsOptional()
    subcategoryId: number;

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

    @IsObject()
    @IsOptional()
    @Type(() => Object)
    data: object;

    @IsObject()
    @IsOptional()
    @Type(() => Object)
    metadata: object;

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
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    id: number;

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