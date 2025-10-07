import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implémenter la logique métier pour zones et zone quests
  // - findZone(id)
  // - updateZone(id, data)
  // - findZoneQuests(zoneId)
  // - createZoneQuest(zoneId, data)
  // - updateZoneQuest(questId, data)
  // - deleteZoneQuest(questId)
}
