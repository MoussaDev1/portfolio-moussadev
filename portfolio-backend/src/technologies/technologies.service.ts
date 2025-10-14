import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechCategory, TechStatus } from '@prisma/client';

@Injectable()
export class TechnologiesService {
  constructor(private prisma: PrismaService) {}

  async create(createTechnologyDto: CreateTechnologyDto) {
    return this.prisma.technology.create({
      data: createTechnologyDto,
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                thumbnailUrl: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                published: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.technology.findMany({
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                thumbnailUrl: true,
                status: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                published: true,
                publishedAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            posts: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { category: 'asc' }, { name: 'asc' }],
    });
  }

  async findByCategory(category: string) {
    return this.prisma.technology.findMany({
      where: { category: category.toUpperCase() as TechCategory },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                thumbnailUrl: true,
                status: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                published: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });
  }

  async findByStatus(status: string) {
    return this.prisma.technology.findMany({
      where: { status: status.toUpperCase() as TechStatus },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                thumbnailUrl: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                published: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.technology.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                status: true,
                type: true,
                featured: true,
                githubUrl: true,
                demoUrl: true,
                createdAt: true,
                dateCompleted: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                content: true,
                published: true,
                publishedAt: true,
                readTime: true,
                views: true,
              },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.technology.findUnique({
      where: { slug },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                status: true,
                type: true,
                featured: true,
                githubUrl: true,
                demoUrl: true,
                createdAt: true,
                dateCompleted: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                content: true,
                published: true,
                publishedAt: true,
                readTime: true,
                views: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    return this.prisma.technology.update({
      where: { id },
      data: updateTechnologyDto,
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                thumbnailUrl: true,
              },
            },
          },
        },
        posts: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                published: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.technology.delete({ where: { id } });
  }

  // Statistiques du Tech Radar
  async getStats() {
    const [
      totalTechs,
      masteredCount,
      learningCount,
      toReviewCount,
      exploringCount,
      deprecatedCount,
      categoryStats,
    ] = await Promise.all([
      this.prisma.technology.count(),
      this.prisma.technology.count({ where: { status: 'MASTERED' } }),
      this.prisma.technology.count({ where: { status: 'LEARNING' } }),
      this.prisma.technology.count({ where: { status: 'TO_REVIEW' } }),
      this.prisma.technology.count({ where: { status: 'EXPLORING' } }),
      this.prisma.technology.count({ where: { status: 'DEPRECATED' } }),
      this.prisma.technology.groupBy({
        by: ['category'],
        _count: { _all: true },
      }),
    ]);

    return {
      total: totalTechs,
      byStatus: {
        mastered: masteredCount,
        learning: learningCount,
        toReview: toReviewCount,
        exploring: exploringCount,
        deprecated: deprecatedCount,
      },
      byCategory: categoryStats.reduce(
        (acc, stat) => {
          acc[stat.category.toLowerCase()] = stat._count._all;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
