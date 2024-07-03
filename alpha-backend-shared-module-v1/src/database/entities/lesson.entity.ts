import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Theme } from './theme.entity';
import { Category } from './category.entity';
// import { Screen } from './screen.entity';
// import { Quiz } from './quiz.entity';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    lessonCode: string;

    @Column()
    themeId: number;

    @ManyToOne(() => Theme, theme => theme.lessons)
    @JoinColumn({ name: 'themeId' })
    theme: Theme;

    @Column()
    categoryId: number;

    @ManyToOne(() => Category, category => category.lessons, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    lessonDuration: string;

    @Column()
    pointsAllocation: number;

    @Column('simple-array', { nullable: true })
    lessonTags: string[];

    @Column('simple-array', { nullable: true })
    gender: string[];

    @Column('simple-array', { nullable: true })
    culturalBackground: string[];

    @Column('simple-array', { nullable: true })
    livingSituation: string[];

    @Column('simple-array', { nullable: true })
    foodIntolerances: string[];

    @Column('simple-array', { nullable: true })
    lifestyle: string[];

    @Column('simple-array', { nullable: true })
    physicalLimitation: string[];

    @Column({ nullable: true })
    internalNotes: string;

    @Column({ nullable: true })
    coverImage: string;

    @Column()
    lessonName: string;

    @Column()
    lessonDescription: string;

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

    //   @OneToMany(() => Screen, screen => screen.lesson)
    //   screens: Screen[];

    //   @ManyToOne(() => Quiz, quiz => quiz.lesson, { nullable: true })
    //   quiz: Quiz;
}
