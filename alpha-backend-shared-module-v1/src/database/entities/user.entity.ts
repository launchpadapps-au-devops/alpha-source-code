import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  AfterLoad,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from './session.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Exclude, Type, instanceToPlain } from 'class-transformer';
import { IsBoolean } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @BeforeInsert()
  @BeforeUpdate()
  fullName() {
    this.name = this.firstName + ' ' + this.lastName;
  }

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isPasswordSet: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  forgotPasswordOtp: string;

  @Column({ type: 'timestamp', nullable: true })
  forgotPasswordOtpExpiresAt: Date;

  private previousPassword: string;
  private previousForgotPasswordOtp: string;

  @BeforeInsert()
  beforeInsert() {
    this.hashPassword();
    this.hashForgotPasswordOtp();
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.password !== this.previousPassword) {
      this.hashPassword();
    }
    if (
      this.forgotPasswordOtp &&
      (this.forgotPasswordOtp !== this.previousForgotPasswordOtp)
    ) {
      this.hashForgotPasswordOtp();
    }
  }

  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  async validatePassword(inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.password);
  }

  hashForgotPasswordOtp() {
    if (this.forgotPasswordOtp) {
      this.forgotPasswordOtp = bcrypt.hashSync(this.forgotPasswordOtp, 10);
      this.forgotPasswordOtpExpiresAt = new Date(new Date().getTime() + 1 * 60000); // Expires in 1 minute
    }
  }

  validateForgotPasswordOtp(inputOtp: string): boolean {
    if (!this.forgotPasswordOtpExpiresAt || this.forgotPasswordOtpExpiresAt < new Date()) {
      return false;
    }
    return bcrypt.compareSync(inputOtp, this.forgotPasswordOtp);
  }

  @AfterLoad()
  loadPreviousValues() {
    this.previousPassword = this.password;
    this.previousForgotPasswordOtp = this.forgotPasswordOtp;
  }

  @Column({ type: 'enum', enum: ['Male', 'Female', 'Non Binary'], nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  @Type(() => Date)
  dob: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  heightUnit: string;

  @Column({ type: 'int', nullable: true })
  weight: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  weightUnit: string;

  @Column({ type: 'int', nullable: true })
  bmi: number;

  @Column({ type: 'boolean', default: false })
  patientDetailsEditConsent: boolean;

  @Column({ type: 'enum', enum: ['alpha-admin-web', 'alpha-patient-mobile', null], default: 'alpha-patient-mobile' })
  platform: string;

  @Column({ type: 'enum', enum: ['patient', 'admin'], nullable: true })
  userType: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'deleted'], default: 'active' })
  status: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.users)
  permission: Permission;

  @Column({ type: 'int', nullable: true })
  termsVersion: number;

  @Column({ type: 'int', nullable: true })
  dataConsentVersion: number;

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

  toJSON() {
    return instanceToPlain(this);
  }
}
