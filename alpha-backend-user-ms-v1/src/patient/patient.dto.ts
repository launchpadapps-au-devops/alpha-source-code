import { Type } from 'class-transformer';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional, Matches, Min, Max } from 'class-validator';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export class CreatePatientDetailsDto {
    @IsString({ message: 'First name must be a string' })
    firstName: string;

    @IsString({ message: 'Last name must be a string' })
    lastName: string;

    @IsString({ message: 'Nick name must be a string' })
    nickName: string;

    @IsString({ message: 'Phone number must be a string' })
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international phone number' })
    phone: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsEnum(Gender, { message: 'Gender must be one of Male, Female, or Other' })
    gender: Gender;

    @IsDateString({}, { message: 'Date of birth must be a valid date string' })
    @Type(() => Date)
    dob: Date;

    @IsString({ message: 'Address must be a string' })
    address: string;

    @IsNumber({}, { message: 'Height must be a number' })
    @Min(30, { message: 'Height must be at least 30 cm' })
    @Max(300, { message: 'Height must be at most 300 cm' })
    @Type(() => Number)
    height: number;

    @IsString({ message: 'Height unit must be a string' })
    @IsOptional()
    heightUnit: string = 'cm';

    @IsNumber({}, { message: 'Weight must be a number' })
    @Min(1, { message: 'Weight must be at least 1 kg' })
    @Max(500, { message: 'Weight must be at most 500 kg' })
    weight: number;

    @IsString({ message: 'Weight unit must be a string' })
    @IsOptional()
    weightUnit: string = 'kg';

    @IsOptional()
    @IsNumber({}, { message: 'BMI must be a number' })
    @Min(10, { message: 'BMI must be at least 10' })
    @Max(100, { message: 'BMI must be at most 100' })
    @Type(() => Number)
    bmi?: number;

    @IsBoolean({ message: 'Patient details edit consent must be a boolean' })
    @Type(() => Boolean)
    patientDetailsEditConsent: boolean;

    @IsString({ message: 'Platform must be a string' })
    @IsEnum(['alpha-admin-web', 'alpha-patient-mobile'], { message: 'Platform must be one of alpha-admin-web or alpha-patient-mobile' })
    platform: string;

    @IsString({ message: 'User type must be a string' })
    @IsEnum(['patient', 'doctor', 'admin'], { message: 'User type must be one of patient, doctor, or admin' })
    userType: string;
}