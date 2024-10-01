import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserType } from 'src/users/enums/user.types';

export class UserTypeDto {
  @ApiPropertyOptional({
    enum: UserType,
    default: UserType.SUPER_ADMIN,
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  @IsOptional()
  readonly user?: UserType = UserType.SUPER_ADMIN;
}
