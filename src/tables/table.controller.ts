import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { HttpExceptionFilter } from 'src/shared/exception-service';

import { Roles } from 'src/auth/guard/roles.decorator';
import { UserType } from 'src/users/enums/user.types';
import { RolesGuard } from 'src/auth/guard/roles.guards';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/createtable.dto';
import { UpdateTableDto } from './dto/updatetable.dto';

@Controller('tables')
@ApiTags('tables')
@UseFilters(new HttpExceptionFilter('tables'))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserType.SUPER_ADMIN,
  UserType.KITCHEN,
  UserType.BILLER,
  UserType.TABLEATTENDANT,
)
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('create')
  async create(@Body() createTableDto: CreateTableDto, @Req() request) {
    const { user } = request;
    return this.tableService.createTable(user, createTableDto);
  }

  @Get('')
  async get(@Body() createTableDto: CreateTableDto, @Req() request) {
    const { user } = request;
    return this.tableService.getTables(user, createTableDto);
  }

  @Put(':id')
  async update(
    @Body() createTableDto: UpdateTableDto,
    @Param('id') id: number,
    @Req() request,
  ) {
    const { user } = request;
    return this.tableService.updateTables(user, id, createTableDto);
  }
}
