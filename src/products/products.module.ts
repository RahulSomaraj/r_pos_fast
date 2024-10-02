import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Product } from './entity/product.enitity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.TOKEN_KEY,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
