import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Lesson, lesson => lesson.category)
  lessons: Lesson[];
}
