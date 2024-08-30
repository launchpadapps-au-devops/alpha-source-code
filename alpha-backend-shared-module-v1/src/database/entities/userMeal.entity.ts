import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('userMealsLogs')
export class UserMealLog {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', nullable: true })
    mealType: string;

    @Column({ type: 'varchar', nullable: true })
    entryType: string;

    @Column({ type: 'varchar', nullable: true })
    mealName: string;

    @Column({ type: 'varchar', nullable: true })
    intakeTime: string;

    @Column({ type: 'timestamp', nullable: true, default: new Date() })
    loggedAt: Date;

    @Column({ type: 'float', nullable: true })
    quantity: number;

    @Column({ type: 'float', nullable: true })
    calories: number;

    @Column({ type: 'varchar', nullable: true })
    unit: string;

    @Column({ type: 'jsonb', nullable: true })
    nutritionData: object;

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
