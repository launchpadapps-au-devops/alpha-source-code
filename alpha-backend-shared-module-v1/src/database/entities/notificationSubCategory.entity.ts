import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { NotificationCategory } from './notificationCategory.entity';

@Entity('notificationSubcategories')
export class NotificationSubcategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    categoryId: number;

    @ManyToOne(() => NotificationCategory, category => category.id)
    category: NotificationCategory;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
