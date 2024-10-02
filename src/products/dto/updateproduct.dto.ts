import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly picture: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly timeRequired: string;
}
