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
import { UpdateCatDto } from './dto/updatecatagories.dto';
import { CreateCatDto } from './dto/createcatagories.dto';
import { UserType } from 'src/users/enums/user.types';
import { CategoryService } from './catagory.service';

@Controller('categories')
@ApiTags('categories')
@UseFilters(new HttpExceptionFilter('categories'))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserType.SUPER_ADMIN,
  UserType.KITCHEN,
  UserType.BILLER,
  UserType.TABLEATTENDANT,
)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() createCatDto: CreateCatDto, @Req() request) {
    const { user } = request;
    return this.categoryService.createCategory(user, createCatDto);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto) {
    return this.categoryService.updateCategory(id, updateCatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}
