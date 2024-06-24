import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from './session.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Exclude, instanceToPlain } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  middleName: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  // Exclude password only when getting a response, but not request.
  @Exclude({ toPlainOnly: true })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    console.log('hashPassword')
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  async validatePassword(inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.password);
  }

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true})
  phone: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'deleted'], default: 'active' })
  status: string;
  
  @Column({ type: 'enum', enum: ['male', 'female'], nullable: true })
  gender: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];
  
  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @ManyToOne(() => Permission, permission => permission.users)
  permission: Permission;

  toJSON() {
    return instanceToPlain(this);
  }
}
