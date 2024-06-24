import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PERMISSION_NAMES } from "../enum/auth/permission";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: PERMISSION_NAMES,
        unique: true
    })
    name: PermissionName;

    @OneToMany(() => User, user => user.permission)
    users: User[];
}