import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('terms_conditions')
export class TermsConditions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'jsonb', nullable: false })
    content: Array<{ heading: string; body: string }>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, { nullable: true })
    createdBy: User;

    @ManyToOne(() => User, { nullable: true })
    updatedBy: User;
}
