import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with base data...');

  // Clean existing data
  await prisma.zoneQuest.deleteMany();
  await prisma.floorQuest.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.project.deleteMany();

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      slug: 'project-1',
      title: 'Project 1',
      description: 'A test project',
      type: 'ZONE_SYSTEM',
      status: 'ACTIVE',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      slug: 'project-2',
      title: 'Project 2',
      description: 'Another test project',
      type: 'FLOOR_SYSTEM',
      status: 'PLANNING',
    },
  });

  // Create Zones for Project 1
  const zone1 = await prisma.zone.create({
    data: {
      name: 'Zone 1',
      description: 'First zone of Project 1',
      order: 1,
      projectId: project1.id,
    },
  });

  await prisma.zone.create({
    data: {
      name: 'Zone 2',
      description: 'Second zone of Project 1',
      order: 2,
      projectId: project1.id,
    },
  });

  // Create Floors for Project 2
  await prisma.floor.create({
    data: {
      name: 'Floor 1',
      description: 'First floor of Project 2',
      order: 1,
      projectId: project2.id,
    },
  });

  await prisma.floor.create({
    data: {
      name: 'Floor 2',
      description: 'Second floor of Project 2',
      order: 2,
      projectId: project2.id,
    },
  });

  // Create Quests for Zone 1
  await prisma.zoneQuest.create({
    data: {
      title: 'Quest 1 in Zone 1',
      userStory: 'Complete the first quest in Zone 1',
      zoneId: zone1.id,
    },
  });

  await prisma.zoneQuest.create({
    data: {
      title: 'Quest 2 in Zone 1',
      userStory: 'Complete the second quest in Zone 1',
      zoneId: zone1.id,
    },
  });

  console.log('✅ Database seeding completed!');
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
