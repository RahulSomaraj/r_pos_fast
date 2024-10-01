import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTokens } from '../entity/auth.entity';
import { User } from 'src/users/entity/user.entity';
import { UserType } from 'src/users/enums/user.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AuthTokens)
    private authRepo: Repository<AuthTokens>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    const result = await Promise.all([
      this.userRepository.findOne({
        where: {
          id: payload.id,
        },
      }),
      this.authRepo.findOne({
        where: {
          userId: payload.id,
        },
      }),
    ]);
    if (result[0] && result[1]) {
      return result[0];
    }
    return null;
  }
}
