import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with MVP Portfolio v1 data...');

  // Clean existing data (order matters for foreign keys)
  console.log('🗑️  Cleaning existing data...');
  await prisma.pomodoroSession.deleteMany();
  await prisma.projectPost.deleteMany();
  await prisma.postTechnology.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.zoneQuest.deleteMany();
  await prisma.floorQuest.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

  console.log('🎨 Creating technologies...');

  // Create Technologies
  const nextjs = await prisma.technology.create({
    data: {
      name: 'Next.js',
      slug: 'nextjs',
      category: 'FRAMEWORKS',
      status: 'MASTERED',
      description: 'Framework React pour applications web modernes',
      websiteUrl: 'https://nextjs.org',
    },
  });

  const react = await prisma.technology.create({
    data: {
      name: 'React',
      slug: 'react',
      category: 'LIBRARIES',
      status: 'MASTERED',
      description:
        'Bibliothèque JavaScript pour construire des interfaces utilisateur',
      websiteUrl: 'https://react.dev',
    },
  });

  const typescript = await prisma.technology.create({
    data: {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'LANGUAGES',
      status: 'MASTERED',
      description: 'Superset typé de JavaScript',
      websiteUrl: 'https://www.typescriptlang.org',
    },
  });

  const nestjs = await prisma.technology.create({
    data: {
      name: 'NestJS',
      slug: 'nestjs',
      category: 'FRAMEWORKS',
      status: 'LEARNING',
      description:
        'Framework Node.js progressif pour construire des applications server-side',
      websiteUrl: 'https://nestjs.com',
    },
  });

  const prismatech = await prisma.technology.create({
    data: {
      name: 'Prisma',
      slug: 'prisma',
      category: 'TOOLS',
      status: 'LEARNING',
      description: 'ORM moderne pour Node.js et TypeScript',
      websiteUrl: 'https://www.prisma.io',
    },
  });

  const postgresql = await prisma.technology.create({
    data: {
      name: 'PostgreSQL',
      slug: 'postgresql',
      category: 'DATABASES',
      status: 'MASTERED',
      description: 'Système de gestion de base de données relationnelle',
      websiteUrl: 'https://www.postgresql.org',
    },
  });

  const tailwind = await prisma.technology.create({
    data: {
      name: 'TailwindCSS',
      slug: 'tailwindcss',
      category: 'FRAMEWORKS',
      status: 'MASTERED',
      description: 'Framework CSS utility-first',
      websiteUrl: 'https://tailwindcss.com',
    },
  });

  console.log('📁 Creating featured projects...');

  // Create Featured Projects
  const portfolioProject = await prisma.project.create({
    data: {
      slug: 'portfolio-personnel',
      title: 'Portfolio Personnel & Dashboard',
      description:
        'Portfolio interactif avec système de gestion de projets et Tech Radar personnel',
      fullDescription: `Ce projet est une plateforme complète qui sert à la fois de portfolio public et d'outil interne de gestion de projets. Il intègre un système innovant de Zone/Floor pour organiser les projets, un Tech Radar pour suivre mon apprentissage des technologies, et un dashboard complet pour gérer mes quêtes et tâches.`,
      type: 'ZONE_SYSTEM',
      status: 'ACTIVE',
      featured: true,
      category: 'Web Development',
      githubUrl: 'https://github.com/MoussaDev1/portfolio-moussadev',
      demoUrl: 'https://moussadev.com',
      highlights: [
        'Architecture Full-Stack moderne avec Next.js 15 et NestJS',
        'Système Zone/Floor innovant pour la gestion de projets',
        'Tech Radar interactif pour suivre mon apprentissage',
        'Interface admin complète avec CRUD pour tous les modules',
        'Intégration Cloudinary pour la gestion des images',
      ],
      challenges: [
        "Conception d'une architecture scalable et maintenable",
        'Implémentation du système Zone/Floor avec Prisma',
        'Gestion des relations complexes entre entités',
        'Optimisation des performances avec Next.js App Router',
      ],
      learnings: [
        'Maîtrise approfondie de Next.js 15 et App Router',
        'Architecture backend avec NestJS et patterns SOLID',
        'Modélisation de données complexes avec Prisma',
        'Intégration de services tiers (Cloudinary)',
      ],
      duration: '3 mois',
      teamSize: 1,
    },
  });

  // Link technologies to portfolio project
  await prisma.projectTechnology.createMany({
    data: [
      { projectId: portfolioProject.id, technologyId: nextjs.id },
      { projectId: portfolioProject.id, technologyId: react.id },
      { projectId: portfolioProject.id, technologyId: typescript.id },
      { projectId: portfolioProject.id, technologyId: nestjs.id },
      { projectId: portfolioProject.id, technologyId: prismatech.id },
      { projectId: portfolioProject.id, technologyId: postgresql.id },
      { projectId: portfolioProject.id, technologyId: tailwind.id },
    ],
  });

  // Second featured project
  const ecommerceProject = await prisma.project.create({
    data: {
      slug: 'ecommerce-platform',
      title: 'Plateforme E-commerce Modern',
      description:
        'Solution e-commerce complète avec gestion des produits, panier et paiements',
      fullDescription: `Plateforme e-commerce full-stack construite avec les technologies web les plus récentes. Inclut une interface utilisateur fluide, un système de panier avancé, intégration de paiements sécurisés, et un panneau d'administration complet pour gérer les produits, commandes et clients.`,
      type: 'FLOOR_SYSTEM',
      status: 'COMPLETED',
      featured: true,
      category: 'E-commerce',
      githubUrl: 'https://github.com/MoussaDev1/ecommerce',
      highlights: [
        'Interface utilisateur moderne et responsive',
        'Système de panier avec gestion des stocks en temps réel',
        'Intégration Stripe pour les paiements sécurisés',
        'Panneau admin complet avec statistiques',
        'Système de recherche et filtres avancés',
      ],
      challenges: [
        'Gestion des états complexes pour le panier',
        'Optimisation des performances pour charger rapidement les catalogues',
        'Sécurisation des transactions de paiement',
        'Gestion des stocks en temps réel',
      ],
      learnings: [
        'Intégration de solutions de paiement (Stripe)',
        'Optimisation des requêtes base de données',
        'Gestion des états globaux avec Context API',
        'Tests end-to-end avec Cypress',
      ],
      duration: '4 mois',
      teamSize: 1,
    },
  });

  await prisma.projectTechnology.createMany({
    data: [
      { projectId: ecommerceProject.id, technologyId: nextjs.id },
      { projectId: ecommerceProject.id, technologyId: react.id },
      { projectId: ecommerceProject.id, technologyId: typescript.id },
      { projectId: ecommerceProject.id, technologyId: postgresql.id },
      { projectId: ecommerceProject.id, technologyId: tailwind.id },
    ],
  });

  // Third featured project
  const dashboardProject = await prisma.project.create({
    data: {
      slug: 'analytics-dashboard',
      title: 'Dashboard Analytics & Reporting',
      description:
        'Tableau de bord interactif avec visualisations de données et rapports personnalisables',
      fullDescription: `Dashboard d'analytics avancé permettant de visualiser et analyser des données complexes à travers des graphiques interactifs, tableaux dynamiques et rapports exportables. Conçu pour offrir des insights actionnables aux décideurs.`,
      type: 'ZONE_SYSTEM',
      status: 'ACTIVE',
      featured: true,
      category: 'Data Visualization',
      githubUrl: 'https://github.com/MoussaDev1/analytics-dashboard',
      demoUrl: 'https://analytics-demo.moussadev.com',
      highlights: [
        'Visualisations interactives avec Chart.js et Recharts',
        'Filtres dynamiques et recherche avancée',
        'Export de rapports en PDF et Excel',
        'Mise à jour en temps réel des données',
        'Tableaux de bord personnalisables',
      ],
      challenges: [
        'Optimisation du rendu de grandes quantités de données',
        'Gestion des mises à jour en temps réel',
        "Conception d'interfaces utilisateur intuitives pour des données complexes",
        'Export de rapports avec mise en page personnalisée',
      ],
      learnings: [
        'Bibliothèques de visualisation de données (Chart.js, Recharts)',
        'Optimisation des performances React pour grandes listes',
        'WebSockets pour les mises à jour temps réel',
        'Génération de PDF côté serveur',
      ],
      duration: '2 mois',
      teamSize: 1,
    },
  });

  await prisma.projectTechnology.createMany({
    data: [
      { projectId: dashboardProject.id, technologyId: nextjs.id },
      { projectId: dashboardProject.id, technologyId: react.id },
      { projectId: dashboardProject.id, technologyId: typescript.id },
      { projectId: dashboardProject.id, technologyId: tailwind.id },
    ],
  });

  // Projets en développement (NON featured - cachés du public)
  console.log('🔨 Creating work-in-progress projects (not featured)...');

  const wipProject1 = await prisma.project.create({
    data: {
      slug: 'social-network-wip',
      title: 'Réseau Social (En développement)',
      description: 'Plateforme sociale avec messagerie en temps réel',
      fullDescription: `Réseau social en cours de développement avec fonctionnalités de messagerie temps réel, fils d'actualité personnalisés, et système de recommandations.`,
      type: 'ZONE_SYSTEM',
      status: 'ACTIVE',
      featured: false, // 🔒 Caché du public
      category: 'Social Network',
      highlights: ['Messagerie temps réel', 'Algorithme de recommandation'],
      challenges: ['Scalabilité des connexions WebSocket'],
      learnings: ['WebSockets', 'Redis', 'Optimisation base de données'],
      duration: '6 mois (en cours)',
      teamSize: 1,
    },
  });

  await prisma.projectTechnology.createMany({
    data: [
      { projectId: wipProject1.id, technologyId: nextjs.id },
      { projectId: wipProject1.id, technologyId: typescript.id },
      { projectId: wipProject1.id, technologyId: postgresql.id },
    ],
  });

  const wipProject2 = await prisma.project.create({
    data: {
      slug: 'ai-content-generator',
      title: 'Générateur de Contenu IA (Privé)',
      description: 'Outil de génération de contenu avec IA générative',
      fullDescription: `Application utilisant des modèles d'IA pour générer du contenu textuel et visuel de qualité professionnelle.`,
      type: 'FLOOR_SYSTEM',
      status: 'PLANNING',
      featured: false, // 🔒 Caché du public
      category: 'AI Tools',
      highlights: ['Intégration OpenAI', 'Génération images'],
      challenges: ['Optimisation coûts API', 'Qualité des résultats'],
      learnings: ['API OpenAI', 'Prompt engineering'],
      duration: '3 mois (planification)',
      teamSize: 1,
    },
  });

  await prisma.projectTechnology.createMany({
    data: [
      { projectId: wipProject2.id, technologyId: nextjs.id },
      { projectId: wipProject2.id, technologyId: typescript.id },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`   - ${3} featured projects created (visible publiquement)`);
  console.log(`   - ${2} work-in-progress projects created (cachés)`);
  console.log(`   - ${7} technologies created`);
  console.log(`   - Project-Technology relations established`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void (async () => {
      await prisma.$disconnect();
    })();
  });
