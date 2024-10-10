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
import { TableStatusType } from '../enums/status.table';

@Entity({ name: 'tables' })
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => User, (user) => user.id)
  created_by: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  served_by: User;

  @Column({ nullable: true })
  no_of_seats: number;

  @Column({
    type: 'enum',
    enum: TableStatusType,
    nullable: true,
  })
  table_status: TableStatusType;

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
