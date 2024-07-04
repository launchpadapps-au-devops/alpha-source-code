import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)\w+$/;

export class PasswordDto {
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(PASSWORD_REGEX, { message: 'Password too weak' })
    password: string;
}
