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
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { CreateZoneQuestDto, UpdateZoneQuestDto } from './dto/zone-quest.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  // === ZONES ENDPOINTS ===

  @Get()
  async findAllZones(@Query('projectId') projectId?: string) {
    return this.zonesService.findAllZones(projectId);
  }

  @Get(':id')
  async findZoneById(@Param('id') id: string) {
    return this.zonesService.findZoneById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createZone(@Body() data: CreateZoneDto) {
    return this.zonesService.createZone(data);
  }

  @Put(':id')
  async updateZone(@Param('id') id: string, @Body() data: UpdateZoneDto) {
    return this.zonesService.updateZone(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteZone(@Param('id') id: string) {
    await this.zonesService.deleteZone(id);
  }

  // === ZONE QUESTS ENDPOINTS ===

  @Get(':id/quests')
  async findZoneQuests(@Param('id') zoneId: string) {
    return this.zonesService.findZoneQuests(zoneId);
  }

  @Post(':id/quests')
  @HttpCode(HttpStatus.CREATED)
  async createZoneQuest(
    @Param('id') zoneId: string,
    @Body() data: CreateZoneQuestDto,
  ) {
    return this.zonesService.createZoneQuest({ ...data, zoneId });
  }

  @Get('quests/:questId')
  async findZoneQuestById(@Param('questId') questId: string) {
    return this.zonesService.findZoneQuestById(questId);
  }

  @Put('quests/:questId')
  async updateZoneQuest(
    @Param('questId') questId: string,
    @Body() data: UpdateZoneQuestDto,
  ) {
    return this.zonesService.updateZoneQuest(questId, data);
  }

  @Delete('quests/:questId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteZoneQuest(@Param('questId') questId: string) {
    await this.zonesService.deleteZoneQuest(questId);
  }

  // === STATISTIQUES ENDPOINTS ===

  @Get(':id/stats')
  async getZoneStats(@Param('id') zoneId: string) {
    return this.zonesService.getZoneStats(zoneId);
  }

  @Get('project/:projectId/overview')
  async getProjectZonesOverview(@Param('projectId') projectId: string) {
    return this.zonesService.getProjectZonesOverview(projectId);
  }
}
