import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity()
export class Theme {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ enum: ['ACTIVE', 'INACTIVE', 'ARCHIVE'], default: 'ACTIVE' })
    status: string;

    @OneToMany(() => Lesson, lesson => lesson.theme)
    lessons: Lesson[];

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
