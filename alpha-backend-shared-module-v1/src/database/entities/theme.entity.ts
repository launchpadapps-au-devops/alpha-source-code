import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, Unique } from 'typeorm';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Plan } from '../entities';

@Entity('themes')
@Unique(['themeCode', 'categoryId']) // Composite unique constraint
export class Theme {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true, unique: true})
    themeCode: number;

    @Column({ type: 'int', nullable: true })
    categoryId: number;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category

    @Column({ type: 'jsonb', nullable: true })
    propertyTags: object;

    @Column({ type: 'varchar', length: 255, nullable: true })
    internalNotes: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    description: string;

    @Column({ enum: ['ACTIVE', 'DRAFT', 'ARCHIVE'], default: 'ACTIVE' })
    status: string;

    @Column({ type: 'boolean', nullable: true, default: false})
    isPublished: boolean;

    @OneToMany(() => Lesson, lesson => lesson.theme)
    lessons: Lesson[];

    @Column({ type: 'jsonb', nullable: true })
    habits: object [];

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

    @ManyToMany(() => Plan, plan => plan.themes)
    plans: Plan[];
}
