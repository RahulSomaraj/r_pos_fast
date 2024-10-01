import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UserService {
  constructor(
    private readonly connection: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(creatUserDto: CreateUserDto) {
    const existingUser: User = await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .getOne();
  }
}
