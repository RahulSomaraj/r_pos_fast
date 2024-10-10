import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entity/user.entity';

@Entity({ name: 'catagories' })
export class Catagory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => User, (user) => user.id)
  created_by: User;

  @Column({
    nullable: true,
    default: false,
  })
  is_deleted: boolean;

  @CreateDateColumn()
  created_date: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
