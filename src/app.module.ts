import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import devConfig from './config/dev.config';
import stagConfig from './config/stag.config';
import * as os from 'os';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { configService } from './config/psql.config';
import { User } from './users/entity/user.entity';
import { AuthTokens } from './auth/entity/auth.entity';
import { UserModule } from './users/user.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets/logo'),
    }),
    ConfigModule.forRoot({
      load: [appConfig, devConfig, stagConfig],
      isGlobal: true,
      envFilePath: join(os.homedir(), 'newshop', `.env`),
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([User, AuthTokens]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.TOKEN_KEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRY },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
