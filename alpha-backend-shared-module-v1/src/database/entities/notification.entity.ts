import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeUpdate } from 'typeorm';
import { User } from '.';

export enum NotificationType {
    SMS = 'sms',
    PUSH = 'push',
    EMAIL = 'email',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    userId: string;

    @ManyToMany(() => User, () => {}, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: User;

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

    @Column({ type: 'boolean', default: false })
    isSeen: boolean;

    @BeforeUpdate()
    updateSeenAt() {
        if (this.isSeen) {
            this.seenAt = new Date();
        }
    }

    @Column({ type: 'timestamp', nullable: true })
    seenAt: Date;

    @Column({ type: 'boolean', default: false })
    isReminded: boolean;

    @BeforeUpdate()
    updateRemindedAt() {
        if (this.isReminded) {
            this.remindedAt = new Date();
        }
    }

    @Column({ type: 'timestamp', nullable: true })
    remindedAt: Date;

    @Column({ type: 'enum', enum: ['pending', 'sent', 'failed'], default: 'pending' })
    status: string;

    @Column({ type: 'jsonb', nullable: true })
    cc: string[];

    @Column({ type: 'jsonb', nullable: true })
    bcc: string[];

    @Column({ type: 'jsonb', nullable: true })
    error: string;

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
