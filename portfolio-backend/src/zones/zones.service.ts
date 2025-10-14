import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { QuestStatus, ZoneQuest } from '@prisma/client';
import { UpdateZoneDto, CreateZoneDto } from './dto/zoneRequest.dto';
import { CreateZoneQuestDto, UpdateZoneQuestDto } from './dto/zone-quest.dto';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  // === ZONES CRUD ===

  async createZone(createZoneDto: CreateZoneDto) {
    // Si order non spécifié, prendre le prochain disponible
    let finalOrder = createZoneDto.order;
    if (!finalOrder) {
      const lastZone = await this.prisma.zone.findFirst({
        where: { projectId: createZoneDto.projectId },
        orderBy: { order: 'desc' },
      });
      finalOrder = lastZone ? lastZone.order + 1 : 1;
    }

    // Vérifier que le projet existe
    const project = await this.prisma.project.findUnique({
      where: { id: createZoneDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createZoneDto.projectId} not found`,
      );
    }

    const createZone = await this.prisma.zone.create({
      data: {
        ...createZoneDto,
        order: finalOrder,
      },
      include: {
        project: true,
        quests: true,
      },
    });
    try {
      return createZone;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          `Zone with order ${finalOrder} already exists for this project`,
        );
      }
      throw error;
    }
  }

  async findAllZones(projectId?: string) {
    const findZones = await this.prisma.zone.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: true,
        quests: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
    if (!findZones) {
      throw new NotFoundException(`No zones found`);
    }
    return findZones;
  }

  async findZoneById(id: string) {
    const findZone = await this.prisma.zone.findUnique({
      where: { id },
      include: {
        project: true,
        quests: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!findZone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }
    return findZone;
  }

  async updateZone(id: string, updateZoneDto: UpdateZoneDto) {
    await this.findZoneById(id); // Vérifier existence
    const updatedZone = await this.prisma.zone.update({
      where: { id },
      data: updateZoneDto,
      include: {
        project: true,
        quests: true,
      },
    });
    try {
      return updatedZone;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          `Zone with order ${updateZoneDto.order} already exists for this project`,
        );
      }
      throw error;
    }
  }

  async deleteZone(id: string) {
    await this.findZoneById(id); // Vérifier existence

    return await this.prisma.zone.delete({
      where: { id },
      include: {
        project: true,
        quests: true,
      },
    });
  }

  // === ZONE QUESTS CRUD ===

  async findZoneQuests(zoneId: string) {
    await this.findZoneById(zoneId); // Vérifier que la zone existe

    const findZoneQuests = await this.prisma.zoneQuest.findMany({
      where: { zoneId },
      include: {
        zone: {
          include: { project: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return findZoneQuests;
  }

  async findZoneQuestById(questId: string) {
    const findZoneQuest = await this.prisma.zoneQuest.findUnique({
      where: { id: questId },
      include: {
        zone: {
          include: { project: true },
        },
      },
    });

    if (!findZoneQuest) {
      throw new NotFoundException(`Zone quest with ID ${questId} not found`);
    }
    return findZoneQuest;
  }

  async createZoneQuest(id: string, createZoneQuestDto: CreateZoneQuestDto) {
    await this.findZoneById(id); // Vérifier que la zone existe

    const createZoneQuest = await this.prisma.zoneQuest.create({
      data: { ...createZoneQuestDto, zoneId: id },
      include: {
        zone: {
          include: { project: true },
        },
      },
    });
    if (!createZoneQuest) {
      throw new NotFoundException(`Zone quest with ID ${id} not found`);
    }
    return createZoneQuest;
  }

  /**
   * Met à jour une quête de zone. Si le statut passe à 'DONE', la date d'achèvement est définie.
   * @param questId
   * @param updateZoneQuestDto
   * @returns {Promise<Partial<ZoneQuest>>}
   */
  async updateZoneQuest(
    questId: string,
    updateZoneQuestDto: UpdateZoneQuestDto,
  ) {
    await this.findZoneQuestById(questId); // Vérifier existence
    // Si passage en DONE, mettre completedAt
    const updateData: Partial<ZoneQuest> = { ...updateZoneQuestDto };
    if (updateZoneQuestDto.status === 'DONE') {
      updateData.completedAt = new Date();
    } else if (updateZoneQuestDto.status) {
      updateData.completedAt = null;
    }
    const updatedZoneQuest = await this.prisma.zoneQuest.update({
      where: { id: questId },
      data: updateData,
      include: {
        zone: {
          include: { project: true },
        },
      },
    });
    if (!updatedZoneQuest) {
      throw new NotFoundException(`Zone quest with ID ${questId} not found`);
    }
    return updatedZoneQuest;
  }

  async deleteZoneQuest(questId: string) {
    await this.findZoneQuestById(questId); // Vérifier existence

    return await this.prisma.zoneQuest.delete({
      where: { id: questId },
      include: {
        zone: {
          include: { project: true },
        },
      },
    });
  }

  // === STATISTIQUES ===

  async getZoneStats(zoneId: string) {
    const zone = await this.findZoneById(zoneId);

    const questStats = await this.prisma.zoneQuest.groupBy({
      by: ['status'],
      where: { zoneId },
      _count: { status: true },
    });
    type QuestStats = { status: QuestStatus; _count: { status: number } };

    const totalQuests = await this.prisma.zoneQuest.count({
      where: { zoneId },
    });

    const totalEstimatedHours = await this.prisma.zoneQuest.aggregate({
      where: { zoneId },
      _sum: { estimatedHours: true },
    });

    const totalActualHours = await this.prisma.zoneQuest.aggregate({
      where: { zoneId },
      _sum: { actualHours: true },
    });

    return {
      zone,
      totalQuests,
      questsByStatus: questStats.reduce(
        (acc: Record<string, number>, stat: QuestStats) => {
          acc[stat.status as string] = stat._count?.status || 0;
          return acc;
        },
        {} as Record<string, number>,
      ),
      totalEstimatedHours: totalEstimatedHours?._sum?.estimatedHours || 0,
      totalActualHours: totalActualHours?._sum?.actualHours || 0,
      completionRate:
        totalQuests > 0
          ? Math.round(
              ((questStats.find((s) => s.status === 'DONE')?._count?.status ||
                0) /
                totalQuests) *
                100,
            )
          : 0,
    };
  }

  async getProjectZonesOverview(projectId: string) {
    const zones = await this.prisma.zone.findMany({
      where: { projectId },
      include: {
        quests: {
          select: {
            status: true,
            estimatedHours: true,
            actualHours: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return zones.map((zone) => {
      const totalQuests = zone.quests.length;
      const completedQuests = zone.quests.filter(
        (q) => q.status === 'DONE',
      ).length;
      const totalEstimated = zone.quests.reduce(
        (sum, q) => sum + (q.estimatedHours || 0),
        0,
      );
      const totalActual = zone.quests.reduce(
        (sum, q) => sum + (q.actualHours || 0),
        0,
      );

      return {
        ...zone,
        questsCount: totalQuests,
        completedQuestsCount: completedQuests,
        completionRate:
          totalQuests > 0
            ? Math.round((completedQuests / totalQuests) * 100)
            : 0,
        totalEstimatedHours: totalEstimated,
        totalActualHours: totalActual,
      };
    });
  }
}
