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
import { PartialType } from '@nestjs/mapped-types';

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
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  challenges?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learnings?: string[];

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

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
