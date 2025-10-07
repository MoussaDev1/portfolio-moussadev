import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FloorsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implémenter la logique métier pour floors et floor quests
  // - findFloor(id)
  // - updateFloor(id, data)
  // - findFloorQuests(floorId)
  // - createFloorQuest(floorId, data)
  // - updateFloorQuest(questId, data)
  // - deleteFloorQuest(questId)
}
