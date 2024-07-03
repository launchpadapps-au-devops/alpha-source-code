import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'updatedBy' })
    updatedBy: User;
  
}