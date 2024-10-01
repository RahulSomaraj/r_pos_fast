import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { UserType } from './enums/user.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guard/roles.guards';
import { Roles } from 'src/auth/guard/roles.decorator';
import { HttpExceptionFilter } from 'src/shared/exception-service';
import { UserService } from './user.service';

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
export class UserController {
  constructor(private readonly userService: UserService) {}
}
