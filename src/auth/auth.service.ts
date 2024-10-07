import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [
        { user_name: username.trim() },
        { contact_email: username.trim() },
        { contact_number: username.trim() },
      ],
    });

    if (user && (await bcrypt.compare(password, user?.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
