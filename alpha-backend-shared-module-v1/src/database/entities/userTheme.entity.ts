import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { UserPlan } from './userPlan.entity';
  import { Theme } from './theme.entity';
import { User } from '.';
import { UserLesson } from './userLesson.entity';
  
  @Entity('userThemes')
  export class UserTheme {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userLifestylePlanId: string;

    @ManyToOne(() => UserPlan, UserPlan => UserPlan.userThemes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userLifestylePlanId' })
    userLifestylePlan: UserPlan;

    @Column()
    themeId: number;
  
    @ManyToOne(() => Theme, { nullable: false })
    @JoinColumn({ name: 'themeId' })
    theme: Theme;
  
    @Column({ type: 'boolean', default: false })
    isCompleted: boolean;

    @Column({ type: 'integer', default: 0 })
    progress: number;
  
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
  
    @OneToMany(() => UserLesson, UserLesson => UserLesson.userTheme)
    userLessons: UserLesson[];
  }
  