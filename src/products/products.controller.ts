import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guard/roles.guards';
import { Roles } from 'src/auth/guard/roles.decorator';
import { HttpExceptionFilter } from 'src/shared/exception-service';
import { ProductService } from './products.service';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { CreateProductDto } from './dto/createproduct.dto';
import { UserType } from 'src/users/enums/user.types';

@Controller('products')
@ApiTags('products')
@UseFilters(new HttpExceptionFilter('products'))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserType.SUPER_ADMIN,
  UserType.KITCHEN,
  UserType.BILLER,
  UserType.TABLEATTENDANT,
)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto, @Req() request) {
    const { user } = request;
    return this.productService.createProduct(user, createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
