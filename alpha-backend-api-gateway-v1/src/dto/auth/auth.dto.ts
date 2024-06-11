import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
    @ApiProperty({
        type: String,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    password: string;
}

export class ChangePasswordDto {
    @ApiProperty({
        type: String
    })
    @IsString()
    oldPassword: string;

    @ApiProperty({
        type: String,
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
    newPassword: string;
}