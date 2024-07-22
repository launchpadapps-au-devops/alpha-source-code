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
import { User } from '.';

@Entity('userLessons')
export class UserLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

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

  @Column({ type: 'float', nullable: true, default: 0 })
  pointsEarned: number;

  @Column({ type: 'integer', default: 0 })
  quizRetryCount: number;

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
