import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDateString, IsNumber, IsBoolean, IsOptional, IsObject, IsArray } from 'class-validator';

export class CreateStaffDto {
    @ApiProperty({ example: 'John' })
    @IsString({ message: 'First name must be a string' })
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString({ message: 'Last name must be a string' })
    lastName: string;

    // profilePic
    @ApiProperty({ example: 'https://sample.com/sample.jpg' })
    @IsOptional()
    @IsString()
    profilePicture?: string;

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

    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: 'Role id must be a number' })
    @Type(() => Number)
    @IsOptional()
    roleId: number;
}

export class StaffResponseDto extends CreateStaffDto {
    @ApiProperty({ example: 'uuid' })
    @IsString()
    id: string;

    @ApiProperty({
        example: {
            id: 1,
            name: 'role'
        }
    })
    @IsObject()
    @IsOptional()
    role: object

    @ApiProperty({
        example: [
            {
                name: 'permission',
                id: 1
            }
        ]
    })
    @IsArray()
    permissions: object[]

    @ApiProperty({ example: 'alpha-admin-web' })
    @IsString({ message: 'Platform must be a string' })
    @IsEnum(['alpha-admin-web', 'alpha-patient-mobile'], { message: 'Platform must be one of alpha-admin-web or alpha-patient-mobile' })
    @IsOptional()
    platform: string = 'alpha-admin-web';

    @ApiProperty({ example: 'staff' })
    @IsString({ message: 'User type must be a string' })
    @IsEnum(['patient', 'staff', 'admin'], { message: 'User type must be one of patient, doctor, or admin' })
    @IsOptional()
    userType: string = 'staff';
}

