import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserType } from '../enums/user.types';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  contactNumber: string;

  @Column({ unique: true })
  contactEmail: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  pincode: string;

  @CreateDateColumn()
  addDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  joinDate: Date;

  @Column({ nullable: true })
  leaveDate: Date;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  aadhar: string;

  @Column()
  officeLocation: string;

  @Column()
  post: string;

  @Column({
    nullable: true,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true,
  })
  userType: UserType;

  @Column({
    nullable: true,
    default: false,
  })
  isDeleted: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    return (
      this.password &&
      (await new Promise(async (resolve, reject) => {
        if (this.password) {
          this.password = await bcrypt.hash(
            this.password,
            parseInt(process.env.SALT_ROUNDS),
          );
          resolve(this.password);
        }
      }))
    );
  }
}
