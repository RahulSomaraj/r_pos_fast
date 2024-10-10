import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Catagory } from './entity/catagory.entity';
import { CreateCatDto } from './dto/createcatagories.dto';
import { UpdateCatDto } from './dto/updatecatagories.dto';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Catagory)
    private categoryRepository: Repository<Catagory>,
  ) {}

  // Create a new category
  async createCategory(
    user: User,
    createCatDto: CreateCatDto,
  ): Promise<Catagory> {
    const category = {
      name: createCatDto.name,
      picture: createCatDto.picture ?? null,
      created_by: user,
      is_deleted: false,
    };
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  // Find all categories
  async findAll(): Promise<Catagory[]> {
    return this.categoryRepository.find();
  }

  // Find one category by ID
  async findOne(id: number): Promise<Catagory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Update category by ID
  async updateCategory(
    id: number,
    updateCatDto: UpdateCatDto,
  ): Promise<Catagory> {
    const category = await this.findOne(id); // Verify the category exists
    Object.assign(category, updateCatDto); // Update category fields
    return this.categoryRepository.save(category);
  }

  // Soft delete category by ID
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id); // Verify the category exists
    await this.categoryRepository.softRemove(category);
  }
}
