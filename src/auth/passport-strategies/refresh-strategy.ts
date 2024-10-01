// refresh-token.strategy.ts

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenService } from '../auth.refresh.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthTokens } from '../entity/auth.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    @InjectRepository(AuthTokens)
    private authTokenRepo: Repository<AuthTokens>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN,
    });
  }

  async validate(payload) {
    const refreshToken = payload.refreshToken;
    const existingLogins = await this.authTokenRepo.find();

    let storedRefreshToken = null;
    for (const userSession of existingLogins) {
      if ((await bcrypt.compare(userSession.token, refreshToken)) == true) {
        storedRefreshToken = userSession;
        break;
      }
    }

    if (!storedRefreshToken || storedRefreshToken.userId !== payload.id) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid Token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.userRepository.findOne({
      where: {
        id: storedRefreshToken.userId,
      },
    });
  }
}
