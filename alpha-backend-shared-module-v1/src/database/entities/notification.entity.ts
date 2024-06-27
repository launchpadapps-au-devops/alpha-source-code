import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum NotificationType {
    SMS = 'sms',
    PUSH = 'push',
    EMAIL = 'email',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb' })
    recipients: string[];

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.EMAIL
    })
    type: NotificationType;

    @Column({ nullable: true })
    categoryId: number;

    @Column({ nullable: true })
    subcategoryId: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    body: string;

    @Column({ nullable: true })
    templateId: number;

    @Column({ nullable: true })
    customTemplate: string;

    @Column({ type: 'jsonb', nullable: true })
    data: object;

    @Column({ type: 'jsonb', nullable: true })
    metadata: object;

    @Column({ default: false })
    proccessed: boolean;

    @Column({ nullable: true })
    isScheduled: boolean;

    @Column({ type: 'timestamp', nullable: true })
    scheduletime: Date;

    @Column({ type: 'timestamp', nullable: true })
    seenAt: Date;

    @Column({ type: 'enum', enum: ['pending', 'sent', 'failed'], default: 'pending' })
    status: string;

    @Column({ type: 'jsonb', nullable: true })
    cc: string[];

    @Column({ type: 'jsonb', nullable: true })
    bcc: string[];

    @Column({ type: 'jsonb', nullable: true })
    error: string;
}
