import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { UserTheme } from './userTheme.entity';
import { Category } from './category.entity';
import { UserLesson, UserPlan } from '.';

@Entity('userCategories')
export class UserCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.lifestylePlans, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    categoryId: number;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    userLifestylePlanId: string;

    @ManyToOne(() => UserPlan, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userLifestylePlanId' })
    userLifestylePlan: UserPlan;

    @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE', 'DRAFT', 'IN_PROGRESS'], default: 'ACTIVE' })
    status: string;

    @Column({ type: 'boolean', default: false })
    isCompleted: boolean;

    @Column({ type: 'date', nullable: true })
    completedAt: Date;

    @Column({ type: 'integer', default: 0 })
    progress: number;

    @Column({ type: 'integer', default: 0 })
    totalReward: number;

    @Column({ type: 'integer', default: 0 })
    totalPoint: number;

    @Column({ type: 'integer', default: 0 })
    totalBadge: number;

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

    @OneToMany(() => UserTheme, userTheme => userTheme.userCategory)
    userThemes: UserTheme[];
  
    @OneToMany(() => UserLesson, UserLesson => UserLesson.userCategory)
    userLessons: UserLesson[];
}