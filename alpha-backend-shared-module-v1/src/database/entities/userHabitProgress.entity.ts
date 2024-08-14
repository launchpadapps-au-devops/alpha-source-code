import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserTheme, Habit, User, UserHabit } from '.';

@Entity('userHabitProgress')
export class UserHabitProgress {
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
  userHabitId: string;

  @ManyToOne(() => UserHabit, userHabit => userHabit.userHabitProgress, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userHabitId' })
  userHabit: UserHabit;

  @Column({ type: 'int', default: 1 })
  day: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'int', default: 1 })
  week: number;

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
