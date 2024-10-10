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
  IsNumber,
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

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly timeRequired: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly category: number;
}
