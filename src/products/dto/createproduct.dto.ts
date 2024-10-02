import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
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
}
