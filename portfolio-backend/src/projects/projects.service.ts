import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/projectRequest.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Permet de créer un nouveau projet
   *
   * On sépare les technologyIds du reste des données du projet pour gérer la relation many-to-many à part, car prisma ne permet pas de gérer ça automatiquement.
   * @param createProjectDto Les données du projet à créer envoyées par le client filtrer grace à un DTO
   * @returns {Promise<Project>}
   *
   * @remarks
   * Avec Prisma, pour gérer une relation many-to-many lors de la création d'un enregistrement, il faut utiliser la syntaxe `connect` ou `create` dans l'objet `data`pour pouvoir créer l'id des technologies associées comme on y a pas accès directement dans le DTO. Et meme si cette données n'est pas directemetn dans le model de Project, on en à besoin pour créer un projet avec des technologies donc pour en mettre le front doit les fournir. Et le DTO récupère cette donnée. Qu'il nous donne maintenant.
   */
  async create(createProjectDto: CreateProjectDto) {
    const { technologyIds, ...projectData } = createProjectDto;

    // Pour l'instant, on ignore les technologies jusqu'à ce qu'on les implémente
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
        // TODO: Implémenter les relations technologies plus tard
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

  /**
   * Affiche tous les projets. Si `featured` est fourni, filtre les projets en fonction de cette valeur.
   *
   * const where = featured !== undefined ? { featured } : {};
   * fonction pour gérer le cas où featured est undefined (non fourni) ou boolean (true/false) ainsi si on veut tous les projets ou seulement les projets mis en avant on peut le gérer. Pour admin je pourrais afficher tous les projets et pour le front seulement les mis en avant. Et chosir ceux que je veux afficher.
   * @param featured
   * @returns {Promise<Project[]>}
   */
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

  /**
   * Affiche un projet en fonction de son slug.
   *
   * A gérer pour remplacer les findOne qui utilise l'id. Et utiliser le slug à la place, pour plus de lisibilité et SEO.
   * @param slug permet de récupérer un projet via son slug
   * @returns {Promise<Project>}
   */
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

  /**
   * Met à jour un projet existant.
   *
   * On sépare les technologyIds du reste des données du projet pour gérer la relation many-to-many à part, car prisma ne permet pas de gérer ça automatiquement.
   * @param id ID du projet à mettre à jour
   * @param updateProjectDto modèle partiel des données du projet à mettre à jour
   * @returns {Promise<Project>}
   */
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

  /**
   * Calcule les statistiques d'un projet.
   *
   * La méthode getProjectStats() calcule le nombre total de quêtes (zones + floors) d'un projet.
   * On utilise la méthode reduce pour additionner le nombre de quêtes dans chaque zone et chaque floor.
   * Pour chaque zone, on additionne la longueur du tableau quests, et pour chaque floor, la longueur de floorQuests.
   * On calcule aussi le nombre de quêtes terminées (status === 'DONE'), le taux d'avancement, le temps total Pomodoro, et le nombre de zones/floors.
   *
   * @param id ID du projet
   * @returns {Promise<ProjectStats>}
   */
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
