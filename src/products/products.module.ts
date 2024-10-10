import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { Catagory } from 'src/catagories/entity/catagory.entity';
import { User } from 'src/users/entity/user.entity';
import { Product } from './entity/product.enitity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Catagory]),
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
