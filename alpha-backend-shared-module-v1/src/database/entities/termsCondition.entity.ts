import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('termConditions')
export class TermsConditions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', default: 1 })
    version: number;

    @Column({ type: 'jsonb', nullable: false })
    content: Array<{ heading: string; body: string }>;

    @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE'], default: 'ACTIVE' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, { nullable: true })
    createdBy: User;

    @ManyToOne(() => User, { nullable: true })
    updatedBy: User;
}
