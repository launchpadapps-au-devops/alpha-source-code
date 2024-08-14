import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, DataSource } from 'typeorm';
import { User } from './user.entity';
import { DataSources } from '../enum/health/data-sources';
import { DataTypes } from '../enum/health/data-types';

@Entity('userHealthData')
export class UserHealthData {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, user => user.userHealthData)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: DataSources })
    source: string;

    @Column({ type: 'enum', enum: DataTypes })
    dataType: string;

    @Column({ type: 'float', nullable: true })
    value: number;

    @Column({ type: 'varchar', nullable: true })
    unit: string;

    @Column({ type: 'timestamp', nullable: true })
    loggedAt: Date;

    @Column({ type: 'jsonb', nullable: true })
    meta: object;

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
