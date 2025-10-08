import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateZoneQuestDto {
  @IsString()
  title: string;

  @IsString()
  userStory: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  definitionOfDone: string[];

  @IsArray()
  @IsString({ each: true })
  manualTests: string[];

  @IsOptional()
  @IsString()
  techDebt?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedHours?: number;
}

export class UpdateZoneQuestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  userStory?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  definitionOfDone?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manualTests?: string[];

  @IsOptional()
  @IsString()
  techDebt?: string;

  @IsOptional()
  @IsEnum(['TODO', 'IN_PROGRESS', 'TESTING', 'DONE', 'BLOCKED'])
  status?: 'TODO' | 'IN_PROGRESS' | 'TESTING' | 'DONE' | 'BLOCKED';

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedHours?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  actualHours?: number;
}
