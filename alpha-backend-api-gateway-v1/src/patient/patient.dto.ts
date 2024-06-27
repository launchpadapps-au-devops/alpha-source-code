import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export class CreatePatientDetailsDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: '+1234567890' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 'abc@sample.com' })
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty({ example: 'Male', enum: ['Male', 'Female', 'Non Binary'] })
    @IsEnum(['Male', 'Female', 'Non Binary'])
    gender: string;

    @ApiProperty({ example: '1990-01-01' })
    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    dob?: Date;

    @ApiProperty({ example: '123, Sample Street' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: 180 })
    @IsOptional()
    @IsNumber()
    height?: number;

    @ApiProperty({ example: 'cm', default: 'cm' })
    @IsOptional()
    @IsString()
    heightUnit?: string;

    @ApiProperty({ example: 70 })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiProperty({ example: 'kg', default: 'kg' })
    @IsOptional()
    @IsString()
    weightUnit?: string;

    @ApiProperty({ example: 21 })
    @IsOptional()
    @IsNumber()
    bmi?: number;

    @ApiProperty({ example: true })
    @IsOptional()
    @IsBoolean()
    patientDetailsEditConsent?: boolean;

    @ApiProperty({ example: 'alpha-patient-mobile', enum: ['alpha-admin-web', 'alpha-patient-mobile'] })
    @IsEnum(['alpha-admin-web', 'alpha-patient-mobile'])
    platform: string = 'alpha-patient-mobile';

    @ApiProperty({ enum: ['patient'], example: 'patient' })
    @IsString()
    @IsEnum(['patient'])
    userType: string = 'patient';
}

export class PatientResponseDto extends CreatePatientDetailsDto {
    @ApiProperty({ example: '5f8f4f4f4f4f4f4f4f4f4f4f' })
    @IsString()
    id: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    isPasswordSet: boolean;
}

export class ApiResponseDto<T> {
    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: `Patient John Doe's details have been updated successfully` })
    message: string;

    @ApiProperty()
    data: T;

    @ApiProperty()
    meta: object;
}