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

@Entity('dailyTips')
export class DailyTips {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'varchar' })
    content: string;

    @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVE'], default: 'ACTIVE' })
    status: string;

    @Column({ type: 'integer', default: 1 })
    version: number;

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
