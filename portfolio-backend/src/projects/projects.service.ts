import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const { technologyIds, ...projectData } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        ...(technologyIds && {
          technologies: {
            create: technologyIds.map((techId) => ({
              technologyId: techId,
            })),
          },
        }),
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        zones: {
          include: {
            quests: true,
          },
        },
        floors: {
          include: {
            floorQuests: true,
          },
        },
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    return project;
  }

  async findAll(featured?: boolean) {
    const where = featured !== undefined ? { featured } : {};

    return this.prisma.project.findMany({
      where,
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        zones: {
          include: {
            quests: true,
          },
        },
        floors: {
          include: {
            floorQuests: true,
          },
        },
        _count: {
          select: {
            zones: true,
            floors: true,
            posts: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        zones: {
          include: {
            quests: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        floors: {
          include: {
            floorQuests: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        posts: {
          include: {
            post: {
              include: {
                categories: {
                  include: {
                    category: true,
                  },
                },
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        pomodoroSessions: {
          where: {
            completed: true,
          },
          orderBy: {
            completedAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        zones: {
          include: {
            quests: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        floors: {
          include: {
            floorQuests: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { technologyIds, ...projectData } = updateProjectDto;

    // Vérifier que le projet existe
    await this.findOne(id);

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(technologyIds && {
          technologies: {
            deleteMany: {},
            create: technologyIds.map((techId) => ({
              technologyId: techId,
            })),
          },
        }),
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
        zones: {
          include: {
            quests: true,
          },
        },
        floors: {
          include: {
            floorQuests: true,
          },
        },
      },
    });

    return project;
  }

  async remove(id: string) {
    // Vérifier que le projet existe
    await this.findOne(id);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async getProjectStats(id: string) {
    const project = await this.findOne(id);

    const totalQuests =
      project.zones.reduce((acc, zone) => acc + zone.quests.length, 0) +
      project.floors.reduce((acc, floor) => acc + floor.floorQuests.length, 0);

    const completedQuests =
      project.zones.reduce(
        (acc, zone) =>
          acc + zone.quests.filter((quest) => quest.status === 'DONE').length,
        0,
      ) +
      project.floors.reduce(
        (acc, floor) =>
          acc +
          floor.floorQuests.filter((quest) => quest.status === 'DONE').length,
        0,
      );

    const totalPomodoroTime = await this.prisma.pomodoroSession.aggregate({
      where: {
        projectId: id,
        completed: true,
      },
      _sum: {
        duration: true,
      },
    });

    return {
      totalQuests,
      completedQuests,
      completionRate:
        totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0,
      totalPomodoroMinutes: totalPomodoroTime._sum.duration || 0,
      zonesCount: project.zones.length,
      floorsCount: project.floors.length,
    };
  }
}
