import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginUserDto } from './users/dto/userLoginDto';
import { User } from './users/entity/user.entity';
import { AuthTokens } from './auth/entity/auth.entity';
import { RefreshTokenDto } from './auth/dto/refresh-token.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AuthTokens)
    private authTokenRepo: Repository<AuthTokens>,
    private jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getRefreshToken(user: User) {
    const result = await Promise.all([
      this.jwtService.sign(
        { id: user.id, email: user.contact_email },
        { secret: process.env.TOKEN_KEY },
      ),
      this.jwtService.sign(
        { id: user.id, email: user.contact_email },
        { secret: process.env.TOKEN_KEY, expiresIn: '60d' },
      ),
    ]);
    this.authTokenRepo.save(
      this.authTokenRepo.create({
        userId: user.id,
        token: result[1],
      }),
    );
    return {
      id: user.id,
      token: `Bearer ${result[0]}`,
      refreshToken: result[1],
      userName: user.user_name,
      email: user.contact_email,
      userType: user.usertype,
    };
  }

  async logoutAllSessions(user: User) {
    const deletedStatus = await this.authTokenRepo.delete({
      userId: user.id,
    });
    if (deletedStatus.affected > 0) {
      return {
        message: 'Logged out All instances',
      };
    }
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'User instances not found',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async logout(refreshTokenDto: RefreshTokenDto, user: User) {
    const jwtTokenDecode = this.jwtService.verify(
      refreshTokenDto.refreshToken,
      {
        secret: process.env.TOKEN_KEY,
      },
    );
    const usersInstances = await this.authTokenRepo.find({
      where: {
        userId: user.id,
        iat: jwtTokenDecode.iat,
      },
    });
    let storedRefreshToken = null;
    for (const userSession of usersInstances) {
      if (
        await bcrypt.compare(refreshTokenDto.refreshToken, userSession.token)
      ) {
        storedRefreshToken = userSession;
        break;
      }
    }
    if (storedRefreshToken && storedRefreshToken.id) {
      const deletedStatus = await this.authTokenRepo.delete({
        id: storedRefreshToken.id,
      });

      if (deletedStatus.affected > 0) {
        return {
          message: 'Logged Out Succesfully',
        };
      }
    }
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'User instances not found',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async login(
    userLoginDto: LoginUserDto,
    user: User,
  ): Promise<{
    id: number;
    token: string;
    refreshToken: string;
    userName: string;
    email: string;
    userType: string;
  }> {
    const result = await Promise.all([
      this.jwtService.sign(
        { id: user.id, email: user.contact_email },
        { secret: process.env.TOKEN_KEY },
      ),
      this.jwtService.sign(
        { id: user.id, email: user.contact_email },
        {
          secret: process.env.TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
      ),
    ]);
    const iat = await this.jwtService.verify(result[1], {
      secret: process.env.TOKEN_KEY,
    }).iat;
    this.authTokenRepo.save(
      this.authTokenRepo.create({
        userId: user.id,
        token: result[1],
        iat,
      }),
    );
    return {
      id: user.id,
      token: `Bearer ${result[0]}`,
      refreshToken: result[1],
      userName: user.user_name,
      email: user.contact_email,
      userType: user.usertype,
    };
  }
}
