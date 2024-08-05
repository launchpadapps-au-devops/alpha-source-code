import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserTheme } from './userTheme.entity';
import { Lesson } from './lesson.entity';
import { User, UserCategory, UserPlan } from '.';

@Entity('userLessons')
export class UserLesson {
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
  userLifeStylePlanId: string;
  
  @ManyToOne(() => UserPlan, UserPlan => UserPlan.userLessons, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userLifeStylePlanId' })
  userLifeStylePlan: UserPlan;

  @Column()
  userCategoryId: string;
  
  @ManyToOne(() => UserCategory, UserCategory => UserCategory.userThemes, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userCategoryId' })
  userCategory: UserCategory;

  @Column()
  userThemeId: string;

  @ManyToOne(() => UserTheme, userTheme => userTheme.userLessons, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userThemeId' })
  userTheme: UserTheme;

  @Column()
  lessonId: number;

  @ManyToOne(() => Lesson, { nullable: false })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  completedAt: Date;

  @Column({ type: 'float', nullable: true, default: 0 })
  pointsEarned: number;

  @Column({ type: 'integer', default: 0 })
  quizRetryCount: number;

  @Column({ type: 'jsonb', nullable: true })
  quizRetryMeta: object;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'boolean', default: false })
  isFeedbackGiven: boolean;

  @Column({ type: 'boolean', default: false })
  isPositiveFeedback: boolean;

  @Column({ type: 'date', nullable: true })
  feedbackDate: Date;

  @Column({ type: 'boolean', default: false })
  isBookmarked: boolean;
 
  @Column({ type: 'date', nullable: true })
  bookmarkUpdatedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User;
}
