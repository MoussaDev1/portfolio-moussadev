import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  projectId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}

export class UpdateZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['TODO', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
