import { UserDto } from "../database/dto";

export class AuthUtil {
    static isUserAPatient(user: UserDto) {
        return !user.role;
    }
}