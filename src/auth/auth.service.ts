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
        { userName: username.trim() },
        { contactEmail: username.trim() },
        { contactNumber: username.trim() },
      ],
    });
    if (user && (await bcrypt.compare(password, user?.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
