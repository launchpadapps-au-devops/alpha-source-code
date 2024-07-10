import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('permissions')
  export class Permission {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'varchar',
      unique: true,
    })
    name: string;
  
    @ManyToMany(() => User, (user) => user.permissions)
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
  