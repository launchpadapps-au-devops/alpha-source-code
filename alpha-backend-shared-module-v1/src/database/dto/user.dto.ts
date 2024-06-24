import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";

export class UserDto {
    id?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    name?: string;
    username?: string;
    email: string;
    password: string;
    phone?: string;
    dob?: Date;
    status?: string;
    role: Role;
    permission: Permission;
}

