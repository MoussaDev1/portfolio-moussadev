import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { QuestStatus, ZoneQuest } from '@prisma/client';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  // === ZONES CRUD ===

  async findAllZones(projectId?: string) {
    return this.prisma.zone.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: true,
        quests: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findZoneById(id: string) {
    const zone = await this.prisma.zone.findUnique({
      where: { id },
      include: {
        project: true,
        quests: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    return zone;
  }

  async createZone(data: {
    name: string;
    description?: string;
    projectId: string;
    order?: number;
  }) {
    // Si order non spécifié, prendre le prochain disponible
    let finalOrder = data.order;
    if (!finalOrder) {
      const lastZone = await this.prisma.zone.findFirst({
        where: { projectId: data.projectId },
        orderBy: { order: 'desc' },
      });
      finalOrder = lastZone ? lastZone.order + 1 : 1;
    }

    // Vérifier que le projet existe
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${data.projectId} not found`,
      );
    }

    try {
      return await this.prisma.zone.create({
        data: {
          name: data.name,
          description: data.description,
          projectId: data.projectId,
          order: finalOrder,
        },
        include: {
          project: true,
          quests: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Zone with order ${finalOrder} already exists for this project`,
          );
        }
      }
      throw error;
    }
  }

  async updateZone(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
      order?: number;
    },
  ) {
    await this.findZoneById(id); // Vérifier existence

    try {
      return await this.prisma.zone.update({
        where: { id },
        data,
        include: {
          project: true,
          quests: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Zone with order ${data.order} already exists for this project`,
          );
        }
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

    return this.prisma.zoneQuest.findMany({
      where: { zoneId },
      include: {
        zone: {
          include: { project: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findZoneQuestById(questId: string) {
    const quest = await this.prisma.zoneQuest.findUnique({
      where: { id: questId },
      include: {
        zone: {
          include: { project: true },
        },
      },
    });

    if (!quest) {
      throw new NotFoundException(`Zone quest with ID ${questId} not found`);
    }

    return quest;
  }

  async createZoneQuest(data: {
    title: string;
    userStory: string;
    definitionOfDone: string[];
    manualTests: string[];
    techDebt?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    estimatedHours?: number;
    zoneId: string;
  }) {
    await this.findZoneById(data.zoneId); // Vérifier que la zone existe

    return await this.prisma.zoneQuest.create({
      data,
      include: {
        zone: {
          include: { project: true },
        },
      },
    });
  }

  async updateZoneQuest(
    questId: string,
    data: {
      title?: string;
      userStory?: string;
      definitionOfDone?: string[];
      manualTests?: string[];
      techDebt?: string;
      status?: 'TODO' | 'IN_PROGRESS' | 'TESTING' | 'DONE' | 'BLOCKED';
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      estimatedHours?: number;
      actualHours?: number;
    },
  ) {
    await this.findZoneQuestById(questId); // Vérifier existence

    // Si passage en DONE, mettre completedAt
    const updateData: Partial<ZoneQuest> = { ...data };
    if (data.status === 'DONE') {
      updateData.completedAt = new Date();
    } else if (data.status) {
      updateData.completedAt = null;
    }

    return await this.prisma.zoneQuest.update({
      where: { id: questId },
      data: updateData,
      include: {
        zone: {
          include: { project: true },
        },
      },
    });
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
