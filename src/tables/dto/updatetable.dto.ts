import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TableStatusType } from '../enums/status.table';

export class UpdateTableDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly picture?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly numberOfSeats?: number;

  @ApiProperty()
  @IsEnum(TableStatusType)
  @IsOptional()
  tableStatus?: TableStatusType;
}
