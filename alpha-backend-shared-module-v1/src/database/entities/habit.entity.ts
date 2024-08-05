import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Theme } from './theme.entity';
import { Category } from './category.entity';

@Entity('habits')
export class Habit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    themeId: number;

    @ManyToOne(() => Theme, theme => theme.habits)
    @JoinColumn({ name: 'themeId' })
    theme: Theme;

    @Column({ type: 'int', nullable: true })
    order: number;

    @Column({ nullable: true })
    name: string;

    @Column({ type: 'float', nullable: true })
    timeAllocation: number;

    @Column({ type: 'float', nullable: true })
    pointAllocation: number;

    @Column({ nullable: true })
    instructions: string;

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
