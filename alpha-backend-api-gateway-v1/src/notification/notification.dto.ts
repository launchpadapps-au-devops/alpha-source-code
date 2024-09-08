import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsArray } from 'class-validator';
import { IsString, IsEnum, IsOptional, IsNumber, IsDateString, IsUUID, IsObject } from 'class-validator';
import { NotificationType } from '@launchpadapps-au/alpha-shared';

export class CreateNotificationPreferenceDto {
    @ApiProperty({ example: 'uuid', required: true })
    @IsUUID()
    userId: string;

    @ApiProperty({ example: 'push', enum: NotificationType, required: false })
    @IsEnum(NotificationType)
    @IsOptional()
    type?: NotificationType = NotificationType.PUSH;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    subcategoryId?: number;

    @ApiProperty({ example: { key: 'value' }, required: false })
    @IsObject()
    @IsOptional()
    metadata?: object;

    @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'ARCHIVE', 'INACTIVE'], required: false })
    @IsString()
    @IsOptional()
    status?: string = 'ACTIVE';
}

export class UpdateNotificationPreferenceDto extends CreateNotificationPreferenceDto {
    @ApiProperty({ example: 'uuid' })
    @IsUUID()
    id: string;
}

export class NotificationPreferenceResponseDto extends CreateNotificationPreferenceDto {
    @ApiProperty({ example: 'uuid' })
    @IsUUID()
    id: string;

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

export class CreateNotificationDto {
    @ApiProperty({ example: 'uuid', required: true })
    @IsString()
    userId: string;

    @ApiProperty({ example: ['recipient1', 'recipient2'], required: true })
    @IsArray()
    @IsString({ each: true })
    recipients: string[];

    @ApiProperty({ example: 'email', enum: NotificationType, required: false })
    @IsEnum(NotificationType)
    @IsOptional()
    type?: NotificationType = NotificationType.EMAIL;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    subcategoryId?: number;

    @ApiProperty({ example: 'Notification Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Notification Body', required: false })
    @IsString()
    @IsOptional()
    body?: string;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    templateId?: number;

    @ApiProperty({ example: 'Custom Template', required: false })
    @IsString()
    @IsOptional()
    customTemplate?: string;

    @ApiProperty({ example: { key: 'value' }, required: false })
    @IsObject()
    @IsOptional()
    data?: object;

    @ApiProperty({ example: { key: 'value' }, required: false })
    @IsObject()
    @IsOptional()
    metadata?: object;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    proccessed?: boolean = false;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isScheduled?: boolean;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', required: false })
    @IsDateString()
    @IsOptional()
    scheduletime?: Date;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', required: false })
    @IsDateString()
    @IsOptional()
    seenAt?: Date;

    @ApiProperty({ example: 'pending', enum: ['pending', 'sent', 'failed'], required: false })
    @IsString()
    @IsOptional()
    status?: string = 'pending';

    @ApiProperty({ example: ['cc1', 'cc2'], required: false })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    cc?: string[];

    @ApiProperty({ example: ['bcc1', 'bcc2'], required: false })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    bcc?: string[];

    @ApiProperty({ example: 'Error details', required: false })
    @IsString()
    @IsOptional()
    error?: string;
}

export class UpdateNotificationDto {
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z', required: false })
    @IsDateString()
    @IsOptional()
    seenAt?: Date;

    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;
}

export class NotificationResponseDto extends CreateNotificationDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    // is seen
    @ApiProperty({ example: false })
    @IsBoolean()
    seen: boolean;

    // seen at
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
    @IsDateString()
    seenAt: Date;

    // is reminded
    @ApiProperty({ example: false })
    @IsBoolean()
    isReminded: boolean;

    // reminded at
    @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
    @IsDateString()

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
