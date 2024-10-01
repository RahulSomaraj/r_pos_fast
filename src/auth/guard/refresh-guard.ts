// refresh-token.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../auth.refresh.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthTokens } from '../entity/auth.entity';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AuthTokens)
    private authTokenRepo: Repository<AuthTokens>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.body?.refreshToken;

    if (!refreshToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Incorrect password for the user this line ',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decodedToken = this.jwtService.verify(refreshToken);
      const existingLogins = await this.authTokenRepo.find({
        where: {
          userId: decodedToken.id,
        },
      });
      let storedRefreshToken = null;
      for (const userSession of existingLogins) {
        if (await bcrypt.compare(refreshToken, userSession.token)) {
          storedRefreshToken = userSession;
          break;
        }
      }
      if (
        !storedRefreshToken ||
        storedRefreshToken.userId !== decodedToken.id
      ) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Credentials Expired please login again and continue',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      request.user = await this.userRepository.findOne({
        where: {
          id: storedRefreshToken.userId,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Error processing credentials',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
