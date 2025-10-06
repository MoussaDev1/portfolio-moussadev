import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Post()
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    if (category) {
      return this.technologiesService.findByCategory(category);
    }
    if (status) {
      return this.technologiesService.findByStatus(status);
    }
    return this.technologiesService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.technologiesService.getStats();
  }

  @Get(':identifier')
  findOne(@Param('identifier') identifier: string) {
    // Si l'identifier est un UUID, rechercher par ID, sinon par slug
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    if (isUuid) {
      return this.technologiesService.findOne(identifier);
    } else {
      return this.technologiesService.findBySlug(identifier);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ) {
    return this.technologiesService.update(id, updateTechnologyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}
