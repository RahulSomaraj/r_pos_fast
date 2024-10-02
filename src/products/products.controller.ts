import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserType } from './enums/user.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guard/roles.guards';
import { Roles } from 'src/auth/guard/roles.decorator';
import { HttpExceptionFilter } from 'src/shared/exception-service';
import { ProductService } from './products.service';

@Controller('users')
@ApiTags('users')
@UseFilters(new HttpExceptionFilter('User'))
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

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createUser(createProductDto);
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
    return this.productService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
