import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '.';

export enum NotificationType {
    SMS = 'sms',
    PUSH = 'push',
    EMAIL = 'email',
}

@Entity('notificationPreference')
export class NotificationPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.notificationPreference, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.PUSH
    })
    type: NotificationType;

    @Column({ nullable: true })
    categoryId: number;

    @Column({ nullable: true })
    subcategoryId: number;

    @Column({ type: 'jsonb', nullable: true })
    metadata: object;

    @Column({ type: 'enum', enum: ['ACTIVE', 'ARCHIVE', 'INACTIVE'], default: 'ACTIVE' })
    status: string;

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
