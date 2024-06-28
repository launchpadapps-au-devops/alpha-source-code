import { User } from './user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column({ type: 'varchar', nullable: true })
    deviceInfo: string;

    @Column({ type: 'varchar', nullable: true })
    ipAddress: string;

    @Column({
        unique: true
    })
    accessToken: string;

    @Column()
    accessTokenExpiresAt: Date;

    @Column()
    refreshToken: string;

    @Column()
    refreshTokenExpiresAt: Date;

    @Column({
        default: false
    })
    isInvalidated: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.sessions, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: User;
}