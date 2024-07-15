import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Theme } from './theme.entity';

@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true, unique: true})
    planCode: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    internalNotes: string;

    @Column({ enum: ['ACTIVE', 'DRAFT', 'ARCHIVE'], default: 'ACTIVE' })
    status: string;

    @Column({ type: 'boolean', nullable: true, default: false})
    isPublished: boolean;

    @ManyToMany(() => Theme, theme => theme.plans)
    @JoinTable({
        name: 'planThemes',
        joinColumn: { name: 'planId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'themeId', referencedColumnName: 'id' },
    })
    themes: Theme[];
    
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
