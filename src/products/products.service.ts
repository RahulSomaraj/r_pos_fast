import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import { Product } from './entity/product.enitity';
import { CreateProductDto } from './dto/createproduct.dto';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { User } from 'src/users/entity/user.entity';
import { Catagory } from 'src/catagories/entity/catagory.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly connection: DataSource,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Catagory)
    private catagoryRepository: Repository<Catagory>,
  ) {}

  async createProduct(
    user: User,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const category = await  this.catagoryRepository.findOne({
      where: {
        id: createProductDto.category,
      },
    });
    const product = {
      name: createProductDto.name,
      picture: createProductDto.picture ?? null,
      created_by: user,
      time_required: createProductDto.timeRequired,
      is_deleted: false,
      catogory: category,
    };
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const user = await this.productRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `User with ID ${id} not found`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  async updateProduct(
    id: number,
    updateUserDto: UpdateProductDto,
  ): Promise<Product> {
    const user = await this.findOne(id); // Verify the user exists
    Object.assign(user, updateUserDto); // Update user fields
    return this.productRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // Verify the user exists
    await this.productRepository.softRemove(user);
  }
}
