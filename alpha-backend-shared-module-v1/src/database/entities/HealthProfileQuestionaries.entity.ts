import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { User } from './user.entity';

// an schema for health profile question answers
@Entity('healthProfilesQuestionaries')
export class HealthProfileQuestionaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.healthProfileQuestionaries)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  questionVersion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  answerVersion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  answerTags: string;

  @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE'], default: 'ACTIVE' })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  question: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  questionType: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  questionTag: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  questionCategory: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  questionSubCategory: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  answerInputType: string;

  @Column({ type: 'jsonb', nullable: true})
  answerOptions: string;

  @Column({ type: 'jsonb', nullable: true})
  answer: object;

  @Column({ type: 'varchar', length: 255, nullable: true})
  answerCategory: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  answerSubCategory: string;

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

  toJSON() {
    return instanceToPlain(this);
  }
}
