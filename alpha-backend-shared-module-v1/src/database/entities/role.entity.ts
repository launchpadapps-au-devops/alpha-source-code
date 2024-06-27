import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ROLE_NAMES, RoleName } from "../enum/auth/role";
import { User } from "./user.entity";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ROLE_NAMES,
        unique: true
    })
    name: RoleName;

    @Column({ type: 'varchar', length: 255, nullable: true})
    description: string | null;

    @OneToMany(() => User, user => user.role)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(() => User, { nullable: true })
    createdBy: User;
  
    @ManyToOne(() => User, { nullable: true })
    updatedBy: User;
  
}