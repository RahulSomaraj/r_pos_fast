import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { AuthTokens } from '../entity/auth.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class CustomJwtStrategy extends PassportStrategy(
  Strategy,
  'custom-jwt',
) {
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
    const [user, authToken] = await Promise.all([
      this.userRepository.findOne(payload.id),
      this.authRepo.findOne({ where: { userId: payload.id } }),
    ]);

    if (user && authToken) {
      return user;
    }
    return null;
  }
}
