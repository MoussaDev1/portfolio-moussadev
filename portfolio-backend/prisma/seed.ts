import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('��� Starting database seed...');

  // Nettoyer les tables existantes
  await prisma.postTag.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.postTechnology.deleteMany();
  await prisma.projectPost.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.pomodoroSession.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.floorQuest.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.project.deleteMany();

  // 1. Créer les technologies
  console.log('��� Creating technologies...');
  const technologies = await Promise.all([
    prisma.technology.create({
      data: {
        name: 'Next.js',
        slug: 'nextjs',
        category: 'FRAMEWORKS',
        status: 'MASTERED',
        description: 'Framework React full-stack',
        websiteUrl: 'https://nextjs.org',
      },
    }),
    prisma.technology.create({
      data: {
        name: 'TypeScript',
        slug: 'typescript',
        category: 'LANGUAGES',
        status: 'MASTERED',
        description: 'Superset typé de JavaScript',
        websiteUrl: 'https://typescriptlang.org',
      },
    }),
    prisma.technology.create({
      data: {
        name: 'NestJS',
        slug: 'nestjs',
        category: 'FRAMEWORKS',
        status: 'LEARNING',
        description: 'Framework Node.js backend',
        websiteUrl: 'https://nestjs.com',
      },
    }),
    prisma.technology.create({
      data: {
        name: 'PostgreSQL',
        slug: 'postgresql',
        category: 'DATABASES',
        status: 'LEARNING',
        description: 'Base de données relationnelle',
        websiteUrl: 'https://postgresql.org',
      },
    }),
  ]);

  // 2. Créer les catégories de blog
  console.log('��� Creating blog categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Développement Web',
        slug: 'developpement-web',
        description: 'Articles sur le dev web',
        color: '#3b82f6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Architecture',
        slug: 'architecture',
        description: 'Patterns et bonnes pratiques',
        color: '#10b981',
      },
    }),
  ]);

  // 3. Créer les tags
  console.log('���️ Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'Tutorial', slug: 'tutorial', color: '#3b82f6' },
    }),
    prisma.tag.create({
      data: { name: 'Full-Stack', slug: 'full-stack', color: '#10b981' },
    }),
  ]);

  // 4. Créer un projet exemple (Zone System)
  console.log('��� Creating example project...');
  const exampleProject = await prisma.project.create({
    data: {
      slug: 'portfolio-dashboard',
      title: 'Personal Dev Dashboard',
      description: 'Dashboard pour gérer mes projets et apprentissages',
      fullDescription:
        'Application full-stack avec Zone/Floor System et Tech Radar',
      type: 'ZONE_SYSTEM',
      status: 'ACTIVE',
      featured: true,
      category: 'Personal Tools',
      highlights: JSON.stringify([
        'Zone/Floor System',
        'Tech Radar interactif',
        'Blog intégré',
      ]),
      duration: 'En cours',
      teamSize: 1,
    },
  });

  // 5. Créer une zone exemple
  console.log('��� Creating example zone...');
  const backendZone = await prisma.zone.create({
    data: {
      name: 'Backend API',
      description: 'API NestJS avec Prisma et PostgreSQL',
      order: 1,
      status: 'IN_PROGRESS',
      projectId: exampleProject.id,
    },
  });

  // 6. Créer quelques quêtes
  console.log('⚔️ Creating example quests...');
  await prisma.quest.createMany({
    data: [
      {
        title: 'Setup NestJS + Prisma',
        userStory: 'En tant que dev, je veux un backend configuré',
        definitionOfDone: JSON.stringify([
          'Projet NestJS initialisé',
          'Prisma configuré',
          'Base de données connectée',
        ]),
        manualTests: JSON.stringify([
          'Serveur démarre sans erreur',
          'Base de données accessible',
        ]),
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        zoneId: backendZone.id,
      },
      {
        title: 'API Projects CRUD',
        userStory: 'En tant que système, je veux gérer les projets',
        definitionOfDone: JSON.stringify([
          'Endpoints CRUD complets',
          'Validation des données',
          'Tests fonctionnels',
        ]),
        manualTests: JSON.stringify([
          'Tester avec Postman',
          'Vérifier validation',
        ]),
        status: 'TODO',
        priority: 'MEDIUM',
        zoneId: backendZone.id,
      },
    ],
  });

  // 7. Créer un article de blog
  console.log('��� Creating example blog post...');
  const post = await prisma.post.create({
    data: {
      slug: 'setup-nestjs-prisma',
      title: 'Setup NestJS avec Prisma et PostgreSQL',
      content: `# Setup NestJS avec Prisma

Guide pour configurer un backend NestJS avec Prisma et PostgreSQL.

## Installation

\`\`\`bash
npm install @nestjs/core @nestjs/common
npm install prisma @prisma/client
\`\`\`

## Configuration

Le schéma Prisma permet de définir les modèles...`,
      excerpt: 'Guide pour configurer NestJS avec Prisma',
      published: true,
      readTime: 5,
      publishedAt: new Date(),
    },
  });

  // 8. Créer les relations
  console.log('��� Creating relations...');
  const nextjsTech = technologies.find((t) => t.name === 'Next.js')!;
  const nestjsTech = technologies.find((t) => t.name === 'NestJS')!;

  await Promise.all([
    // Projet-Technologies
    prisma.projectTechnology.create({
      data: { projectId: exampleProject.id, technologyId: nextjsTech.id },
    }),
    prisma.projectTechnology.create({
      data: { projectId: exampleProject.id, technologyId: nestjsTech.id },
    }),

    // Blog-Relations
    prisma.postCategory.create({
      data: { postId: post.id, categoryId: categories[0].id },
    }),
    prisma.postTag.create({
      data: { postId: post.id, tagId: tags[0].id },
    }),
    prisma.postTechnology.create({
      data: { postId: post.id, technologyId: nestjsTech.id },
    }),
    prisma.projectPost.create({
      data: { postId: post.id, projectId: exampleProject.id },
    }),
  ]);

  // 9. Créer une session pomodoro
  console.log('⏰ Creating pomodoro session...');
  await prisma.pomodoroSession.create({
    data: {
      duration: 50,
      type: 'WORK',
      completed: true,
      notes: 'Setup du backend NestJS',
      projectId: exampleProject.id,
      completedAt: new Date(),
    },
  });

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
