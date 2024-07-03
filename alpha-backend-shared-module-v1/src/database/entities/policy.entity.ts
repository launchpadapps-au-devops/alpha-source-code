import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PolicyType, POLICY_TYPES } from '../enum';

@Entity('policies')
export class Policy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', default: 1 })
    version: number;

    @Column({ type: 'varchar', enum: POLICY_TYPES, nullable: false })
    type: string;

    @Column({ type: 'jsonb', nullable: false })
    content: Array<{ heading: string; body: string }>;

    @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE'], default: 'ACTIVE' })
    status: string;

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
