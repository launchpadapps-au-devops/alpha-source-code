import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Theme } from './theme.entity';
import { Category } from './category.entity';

@Entity('lessons')
@Unique(['lessonCode', 'themeId', 'categoryId']) // Composite unique constraint
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float', nullable: true, unique: true })
    lessonCode: number;

    @Column({ nullable: true })
    themeId: number;

    @ManyToOne(() => Theme, theme => theme.lessons)
    @JoinColumn({ name: 'themeId' })
    theme: Theme;

    @Column({ nullable: true })
    categoryId: number;

    @ManyToOne(() => Category, category => category.lessons, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ type: 'varchar', enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' })
    status: string;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @Column({ type: 'float', nullable: true })
    duration: number;

    @Column({ type: 'float', nullable: true })
    points: number;

    @Column('jsonb', { nullable: true })
    lessonTags: object [];

    @Column({ nullable: true })
    internalNotes: string;

    @Column({ nullable: true })
    coverImage: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    screenData: object;

    @Column({ type: 'jsonb', nullable: true })
    quizData: object;

    @Column({ type: 'jsonb', nullable: true })
    freeTextQuiz: object;

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
