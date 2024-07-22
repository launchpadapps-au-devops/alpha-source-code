import { Type } from 'class-transformer';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional, Matches, Min, Max } from 'class-validator';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export class CreateStaffDto {
    @IsString({ message: 'First name must be a string' })
    firstName: string;

    @IsString({ message: 'Last name must be a string' })
    lastName: string;

    @IsString({ message: 'Phone number must be a string' })
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international phone number' })
    phone: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsOptional()
    password: string;

    @IsString({ message: 'Profile picture must be a string' })
    @IsOptional()
    profilePicture?: string;

    @IsNumber({}, { message: 'Role id must be a number' })
    @Type(() => Number)
    @IsOptional()
    roleId: number;

    @IsString()
    @IsOptional()
    userType: string = 'staff';
}