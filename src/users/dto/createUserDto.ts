import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsString,
  IsDateString,
} from 'class-validator';
import { UserType } from '../enums/user.types';

export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly userName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly contactNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly contactEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly city: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly state: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly pincode: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly aadhar: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly officeLocation: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly userType: string;
}
