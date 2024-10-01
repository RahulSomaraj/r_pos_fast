import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'auth_tokens' })
export class AuthTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  iat: number;

  @Column({ nullable: true, default: false })
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    return (
      this.token &&
      (await new Promise(async (resolve, reject) => {
        if (this.token) {
          this.token = await bcrypt.hash(
            this.token,
            Math.floor(Math.random() + parseInt(process.env.SALT_ROUNDS)),
          );
          resolve(this.token);
        }
      }))
    );
  }
}
