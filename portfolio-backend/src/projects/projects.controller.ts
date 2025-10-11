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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/projectRequest.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  /**
   * Récupère tous les projets.
   * @param featured Indique si seuls les projets mis en avant doivent être récupérés. De type string car reçu en query param donc dans l'url c'est forcément une string
   * @returns Une liste de projets. (avec en paramètre featuredBool qui convertit featured en booléen ou undefined)
   */
  @Get()
  findAll(@Query('featured') featured?: string) {
    const featuredBool =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.projectsService.findAll(featuredBool);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  //STATS
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.projectsService.getProjectStats(id);
  }
}
