import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FloorsService } from './floors.service';
import { CreateFloorDto, UpdateFloorDto } from './dto/floor.dto';
import {
  CreateFloorQuestDto,
  UpdateFloorQuestDto,
} from './dto/floor-quest.dto';

@Controller('floors')
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  // === FLOORS ENDPOINTS ===

  @Get()
  async findAllFloors(@Query('projectId') projectId?: string) {
    return this.floorsService.findAllFloors(projectId);
  }

  @Get(':id')
  async findFloorById(@Param('id') id: string) {
    return this.floorsService.findFloorById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFloor(@Body() data: CreateFloorDto) {
    return this.floorsService.createFloor(data);
  }

  @Put(':id')
  async updateFloor(@Param('id') id: string, @Body() data: UpdateFloorDto) {
    return this.floorsService.updateFloor(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFloor(@Param('id') id: string) {
    await this.floorsService.deleteFloor(id);
  }

  // === FLOOR QUESTS ENDPOINTS ===

  @Get(':id/quests')
  async findFloorQuests(@Param('id') floorId: string) {
    return this.floorsService.findFloorQuests(floorId);
  }

  @Post(':id/quests')
  @HttpCode(HttpStatus.CREATED)
  async createFloorQuest(
    @Param('id') floorId: string,
    @Body() data: CreateFloorQuestDto,
  ) {
    return this.floorsService.createFloorQuest({ ...data, floorId });
  }

  @Get('quests/:questId')
  async findFloorQuestById(@Param('questId') questId: string) {
    return this.floorsService.findFloorQuestById(questId);
  }

  @Put('quests/:questId')
  async updateFloorQuest(
    @Param('questId') questId: string,
    @Body() data: UpdateFloorQuestDto,
  ) {
    return this.floorsService.updateFloorQuest(questId, data);
  }

  @Delete('quests/:questId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFloorQuest(@Param('questId') questId: string) {
    await this.floorsService.deleteFloorQuest(questId);
  }

  // === STATISTIQUES ENDPOINTS ===

  @Get(':id/stats')
  async getFloorStats(@Param('id') floorId: string) {
    return this.floorsService.getFloorStats(floorId);
  }

  @Get('project/:projectId/overview')
  async getProjectFloorsOverview(@Param('projectId') projectId: string) {
    return this.floorsService.getProjectFloorsOverview(projectId);
  }
}

// === NESTED ROUTES UNDER PROJECTS ===

@Controller('projects/:projectId/floors')
export class ProjectFloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  @Get()
  async getProjectFloors(@Param('projectId') projectId: string) {
    return this.floorsService.findAllFloors(projectId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFloor(
    @Param('projectId') projectId: string,
    @Body() data: CreateFloorDto,
  ) {
    return this.floorsService.createFloor({ ...data, projectId });
  }

  @Get(':floorId')
  async getFloorById(@Param('floorId') floorId: string) {
    return this.floorsService.findFloorById(floorId);
  }

  @Put(':floorId')
  async updateFloor(
    @Param('floorId') floorId: string,
    @Body() data: UpdateFloorDto,
  ) {
    return this.floorsService.updateFloor(floorId, data);
  }

  @Delete(':floorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFloor(@Param('floorId') floorId: string) {
    await this.floorsService.deleteFloor(floorId);
  }

  @Get(':floorId/stats')
  async getFloorStats(@Param('floorId') floorId: string) {
    return this.floorsService.getFloorStats(floorId);
  }

  // === FLOOR QUESTS (NESTED) ===

  @Get(':floorId/quests')
  async getFloorQuests(@Param('floorId') floorId: string) {
    return this.floorsService.findFloorQuests(floorId);
  }

  @Post(':floorId/quests')
  @HttpCode(HttpStatus.CREATED)
  async createFloorQuest(
    @Param('floorId') floorId: string,
    @Body() data: CreateFloorQuestDto,
  ) {
    return this.floorsService.createFloorQuest({ ...data, floorId });
  }

  @Get(':floorId/quests/:questId')
  async getFloorQuestById(@Param('questId') questId: string) {
    return this.floorsService.findFloorQuestById(questId);
  }

  @Put(':floorId/quests/:questId')
  async updateFloorQuest(
    @Param('questId') questId: string,
    @Body() data: UpdateFloorQuestDto,
  ) {
    return this.floorsService.updateFloorQuest(questId, data);
  }

  @Delete(':floorId/quests/:questId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFloorQuest(@Param('questId') questId: string) {
    await this.floorsService.deleteFloorQuest(questId);
  }
}
