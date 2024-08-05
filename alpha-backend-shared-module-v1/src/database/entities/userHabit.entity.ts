import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserTheme, Habit, User } from '.';

@Entity('userHabits')
export class UserHabit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE', 'DRAFT', 'IN_PROGRESS'], default: 'ACTIVE' })
  status: string;

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
  habitId: number;

  @ManyToOne(() => Habit, { nullable: false })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  completedAt: Date;

  @Column({ type: 'date', nullable: true })
  startedAt: Date;

  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @Column({ type: 'float', nullable: true, default: 0 })
  pointsEarned: number;  

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
