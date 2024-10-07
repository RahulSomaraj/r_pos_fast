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
  user_name: string;

  @Column({ unique: true })
  contact_number: string;

  @Column({ unique: true })
  contact_email: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  pincode: string;

  @CreateDateColumn()
  add_date: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ nullable: true })
  join_date: Date;

  @Column({ nullable: true })
  leave_date: Date;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  aadhar: string;

  @Column({ nullable: true })
  office_location: string;

  @Column({
    nullable: true,
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true,
  })
  usertype: UserType;

  @Column({
    nullable: true,
    default: false,
  })
  is_deleted: boolean;

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
