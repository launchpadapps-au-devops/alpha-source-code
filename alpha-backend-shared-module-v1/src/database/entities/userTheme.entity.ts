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
import { User, UserCategory } from '.';
import { UserLesson } from './userLesson.entity';

@Entity('userThemes')
export class UserTheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE', 'DRAFT'], default: 'ACTIVE' })
  status: string;

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
  userCategoryId: string;

  @ManyToOne(() => UserCategory, UserCategory => UserCategory.userThemes, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userCategoryId' })
  userCategory: UserCategory;

  @Column()
  themeId: number;

  @ManyToOne(() => Theme, { nullable: false })
  @JoinColumn({ name: 'themeId' })
  theme: Theme;

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

  @OneToMany(() => UserLesson, UserLesson => UserLesson.userTheme)
  userLessons: UserLesson[];
}
