import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsInt,
  IsUrl,
} from 'class-validator';
import { ProjectType, ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  type?: ProjectType;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  caseStudyUrl?: string;

  @IsOptional()
  @IsString()
  highlights?: string; // JSON stringified array

  @IsOptional()
  @IsString()
  challenges?: string;

  @IsOptional()
  @IsString()
  learnings?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsInt()
  teamSize?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologyIds?: string[]; // Garde les IDs comme array pour les relations
}
