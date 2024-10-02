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

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => User, (user) => user.id)
  created_by: User;

  @Column({ nullable: true })
  time_required: number;

  @Column({
    nullable: true,
    default: false,
  })
  is_deleted: boolean;
}
