import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';

export enum TechCategory {
  LANGUAGES = 'LANGUAGES',
  FRAMEWORKS = 'FRAMEWORKS',
  LIBRARIES = 'LIBRARIES',
  TOOLS = 'TOOLS',
  PLATFORMS = 'PLATFORMS',
  DATABASES = 'DATABASES',
  DEVOPS = 'DEVOPS',
}

export enum TechStatus {
  MASTERED = 'MASTERED',
  LEARNING = 'LEARNING',
  TO_REVIEW = 'TO_REVIEW',
  EXPLORING = 'EXPLORING',
  DEPRECATED = 'DEPRECATED',
}

export class CreateTechnologyDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsEnum(TechCategory)
  category: TechCategory;

  @IsEnum(TechStatus)
  status: TechStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;
}
