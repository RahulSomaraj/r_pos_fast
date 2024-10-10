import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import { Table } from './entity/table.enitity';
import { CreateTableDto } from './dto/createtable.dto';
import { User } from 'src/users/entity/user.entity';
import { UpdateProductDto } from 'src/products/dto/updateproduct.dto';
import { UpdateTableDto } from './dto/updatetable.dto';
import { resolve } from 'path';

@Injectable()
export class TableService {
  constructor(
    private readonly connection: DataSource,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTable(
    authUser: User,
    createTableDto: CreateTableDto,
  ): Promise<Table> {
    const table = {
      name: createTableDto.name,
      picture: createTableDto.picture,
      created_by: authUser,
      served_by: null,
      no_of_seats: createTableDto.numberOfSeats,
      is_deleted: false,
    };
    const newTable = this.tableRepository.create(table);
    const tableCreated = await this.tableRepository.save(newTable);
    return this.tableRepository.findOne({
      where: { id: tableCreated.id },
    });
  }

  async getTables(
    authUser: User,
    createTableDto: CreateTableDto,
  ): Promise<Table> {
    const table = {
      name: createTableDto.name,
      picture: createTableDto.picture,
      created_by: authUser,
      served_by: null,
      no_of_seats: createTableDto.numberOfSeats,
      is_deleted: false,
    };
    const newTable = this.tableRepository.create(table);
    const tableCreated = await this.tableRepository.save(newTable);
    return this.tableRepository.findOne({
      where: { id: tableCreated.id },
    });
  }

  async updateTables(
    authUser: User,
    id: number,
    updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: {
        id: id,
      },
    }); // Verify the user exists
    Object.assign(table, updateTableDto); // Update user fields
    return this.tableRepository.save(table);
  }

  async assignTable(
    authUser: User,
    tableId: number,
    userId: number,
  ): Promise<Table> {
    // Fetch the table and user in parallel
    const [table, user] = await Promise.all([
      this.tableRepository.findOne({
        where: { id: tableId },
      }),
      this.userRepository.findOne({
        where: { id: userId },
      }),
    ]);

    // Verify that both table and user exist
    if (!table) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Table not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Assign the user to the table
    table.served_by = user;

    // Save and return the updated table
    return this.tableRepository.save(table);
  }

  async releaseTable(
    authUser: User,
    tableId: number,
    userId: number,
  ): Promise<Table> {
    // Fetch the table and user in parallel
    const [table, user] = await Promise.all([
      this.tableRepository.findOne({
        where: { id: tableId },
        relations: ['served_by'],
      }),
      this.userRepository.findOne({
        where: { id: userId },
      }),
    ]);

    // Verify that both table and user exist
    if (!table) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Table not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Assign the user to the table
    if (table.served_by.id === userId) {
      table.served_by = null;
    }

    // Save and return the updated table
    return this.tableRepository.save(table);
  }
}
