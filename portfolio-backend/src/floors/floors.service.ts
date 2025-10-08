import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { FloorQuest } from '@prisma/client';

@Injectable()
export class FloorsService {
  constructor(private prisma: PrismaService) {}

  // === FLOORS CRUD ===

  async findAllFloors(projectId?: string) {
    return this.prisma.floor.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: true,
        floorQuests: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findFloorById(id: string) {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      include: {
        project: true,
        floorQuests: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!floor) {
      throw new NotFoundException(`Floor with ID ${id} not found`);
    }

    return floor;
  }

  async createFloor(data: {
    name: string;
    description?: string;
    projectId: string;
    order?: number;
  }) {
    // Si order non spécifié, prendre le prochain disponible
    let finalOrder = data.order;
    if (!finalOrder) {
      const lastFloor = await this.prisma.floor.findFirst({
        where: { projectId: data.projectId },
        orderBy: { order: 'desc' },
      });
      finalOrder = lastFloor ? lastFloor.order + 1 : 1;
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
      return await this.prisma.floor.create({
        data: {
          name: data.name,
          description: data.description,
          projectId: data.projectId,
          order: finalOrder,
        },
        include: {
          project: true,
          floorQuests: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Floor with order ${finalOrder} already exists for this project`,
          );
        }
      }
      throw error;
    }
  }

  async updateFloor(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
      order?: number;
    },
  ) {
    await this.findFloorById(id); // Vérifier existence

    try {
      return await this.prisma.floor.update({
        where: { id },
        data,
        include: {
          project: true,
          floorQuests: true,
        },
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Floor with order ${data.order} already exists for this project`,
          );
        }
      }
      throw error;
    }
  }

  async deleteFloor(id: string) {
    await this.findFloorById(id); // Vérifier existence

    return await this.prisma.floor.delete({
      where: { id },
      include: {
        project: true,
        floorQuests: true,
      },
    });
  }

  // === FLOOR QUESTS CRUD ===

  async findFloorQuests(floorId: string) {
    await this.findFloorById(floorId); // Vérifier que le floor existe

    return this.prisma.floorQuest.findMany({
      where: { floorId },
      include: {
        floor: {
          include: { project: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findFloorQuestById(questId: string) {
    const quest = await this.prisma.floorQuest.findUnique({
      where: { id: questId },
      include: {
        floor: {
          include: { project: true },
        },
      },
    });

    if (!quest) {
      throw new NotFoundException(`Floor quest with ID ${questId} not found`);
    }

    return quest;
  }

  async createFloorQuest(data: {
    title: string;
    userStory: string;
    definitionOfDone: string[];
    manualTests: string[];
    techDebt?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    estimatedHours?: number;
    floorId: string;
  }) {
    await this.findFloorById(data.floorId); // Vérifier que le floor existe

    return await this.prisma.floorQuest.create({
      data,
      include: {
        floor: {
          include: { project: true },
        },
      },
    });
  }

  async updateFloorQuest(
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
    await this.findFloorQuestById(questId); // Vérifier existence

    // Si passage en DONE, mettre completedAt
    const updateData: Partial<FloorQuest> = { ...data };
    if (data.status === 'DONE') {
      updateData.completedAt = new Date();
    } else if (data.status) {
      updateData.completedAt = null;
    }

    return await this.prisma.floorQuest.update({
      where: { id: questId },
      data: updateData,
      include: {
        floor: {
          include: { project: true },
        },
      },
    });
  }

  async deleteFloorQuest(questId: string) {
    await this.findFloorQuestById(questId); // Vérifier existence

    return await this.prisma.floorQuest.delete({
      where: { id: questId },
      include: {
        floor: {
          include: { project: true },
        },
      },
    });
  }

  // === STATISTIQUES ===

  async getFloorStats(floorId: string) {
    const floor = await this.findFloorById(floorId);

    const questStats = await this.prisma.floorQuest.groupBy({
      by: ['status'],
      where: { floorId },
      _count: { status: true },
    });

    const totalQuests = await this.prisma.floorQuest.count({
      where: { floorId },
    });

    const totalEstimatedHours = await this.prisma.floorQuest.aggregate({
      where: { floorId },
      _sum: { estimatedHours: true },
    });

    const totalActualHours = await this.prisma.floorQuest.aggregate({
      where: { floorId },
      _sum: { actualHours: true },
    });

    return {
      floor,
      totalQuests,
      questsByStatus: questStats.reduce(
        (acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        },
        {} as Record<string, number>,
      ),
      totalEstimatedHours: totalEstimatedHours._sum.estimatedHours || 0,
      totalActualHours: totalActualHours._sum.actualHours || 0,
      completionRate:
        totalQuests > 0
          ? Math.round(
              ((questStats.find((s) => s.status === 'DONE')?._count.status ||
                0) /
                totalQuests) *
                100,
            )
          : 0,
    };
  }

  async getProjectFloorsOverview(projectId: string) {
    const floors = await this.prisma.floor.findMany({
      where: { projectId },
      include: {
        floorQuests: {
          select: {
            status: true,
            estimatedHours: true,
            actualHours: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return floors.map((floor) => {
      const totalQuests = floor.floorQuests.length;
      const completedQuests = floor.floorQuests.filter(
        (q) => q.status === 'DONE',
      ).length;
      const totalEstimated = floor.floorQuests.reduce(
        (sum, q) => sum + (q.estimatedHours || 0),
        0,
      );
      const totalActual = floor.floorQuests.reduce(
        (sum, q) => sum + (q.actualHours || 0),
        0,
      );

      return {
        ...floor,
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
