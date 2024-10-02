import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { UserType } from './enums/user.types';
import moment from 'moment';

const { v4: uuidv4 } = require('uuid');

@Injectable()
export class UserService {
  constructor(
    private readonly connection: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isExistingUser = await this.userRepository.findOne({
      where: [
        { contact_email: createUserDto.contactEmail },
        { user_name: createUserDto.userName },
        { contact_number: createUserDto.contactNumber },
      ],
    });

    if (isExistingUser) {
      let errorMessage = 'User already exists with the same ';

      if (isExistingUser.contact_email === createUserDto.contactEmail) {
        errorMessage += 'email';
      } else if (isExistingUser.user_name === createUserDto.userName) {
        errorMessage += 'username';
      } else if (
        isExistingUser.contact_number === createUserDto.contactNumber
      ) {
        errorMessage += 'contact number';
      }

      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: errorMessage,
        },
        HttpStatus.CONFLICT,
      );
    }

    const user = {
      uuid: uuidv4(),
      name: createUserDto.name,
      user_name: createUserDto.userName,
      contact_number: createUserDto.contactNumber,
      contact_email: createUserDto.contactEmail,
      address: createUserDto.address ?? null,
      city: createUserDto.city ?? null,
      state: createUserDto.state ?? null,
      pincode: createUserDto.pincode,
      add_date: moment(),
      deleted_at: null,
      join_date: moment(),
      leave_date: null,
      password: createUserDto.password,
      aadhar: createUserDto.aadhar,
      office_location: createUserDto.officeLocation,
      is_active: false,
      usertype: createUserDto.userType ?? UserType.BILLER,
      is_deleted: false,
    };
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Verify the user exists
    Object.assign(user, updateUserDto); // Update user fields
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // Verify the user exists
    await this.userRepository.softRemove(user);
  }
}
