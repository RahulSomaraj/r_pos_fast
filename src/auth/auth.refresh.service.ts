// refresh-token.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthTokens } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(AuthTokens)
    private refreshTokenRepository: Repository<AuthTokens>,
  ) {}

  async createRefreshToken(userId: number, token: string): Promise<AuthTokens> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async removeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
