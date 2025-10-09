import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { ZoneStatus } from '@prisma/client';

export class CreateZoneDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  @IsEnum(ZoneStatus)
  status?: ZoneStatus;

  @IsString()
  projectId: string;
}
