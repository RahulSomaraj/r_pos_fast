import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginUserDto } from './users/dto/userLoginDto';
import { User } from './users/entity/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async appLogin(userLoginDto: LoginUserDto) {
    let token = '';
    const user: User | undefined = await this.userRepository.findOne({
      where: [
        { user_name: userLoginDto.username },
        { user_name: userLoginDto.username },
        { contact_number: userLoginDto.username },
      ],
    });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User not found ',
        },
        HttpStatus.CONFLICT,
      );
    } else if (
      user &&
      (await bcrypt.compare(userLoginDto.password, user.password))
    ) {
      token = this.jwtService.sign(
        { id: user.id, email: user.contact_email },
        { secret: process.env.TOKEN_KEY },
      );
      return {
        id: user.id,
        token: `Bearer ${token}`,
        userName: user.user_name,
        email: user.contact_email,
        userType: user.usertype,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Incorrect password for the user',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
