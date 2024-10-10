import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AssignTableDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly user: number;
}
