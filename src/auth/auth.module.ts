import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import devConfig from 'src/config/dev.config';
import stagConfig from 'src/config/stag.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport-strategies/jwt-strategy';
import { LocalStrategy } from './passport-strategies/local-strategy';
import { RefreshTokenService } from './auth.refresh.service';
import { AuthTokens } from './entity/auth.entity';

import { CustomJwtStrategy } from './passport-strategies/custom-jwt-strategy';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      load: [appConfig, devConfig, stagConfig],
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([AuthTokens, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // secret: configService.get<string>('jwt.secret'),
        secret: process.env.TOKEN_KEY,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    RefreshTokenService,
    LocalStrategy,
    JwtStrategy,
    CustomJwtStrategy,
  ],
  exports: [AuthService, RefreshTokenService],
})
export class AuthModule {}
