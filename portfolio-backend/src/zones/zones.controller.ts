import { Controller } from '@nestjs/common';
import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  // TODO: Implémenter les endpoints zones et zone quests
  // GET /zones/:id
  // PATCH /zones/:id
  // GET /zones/:id/quests
  // POST /zones/:id/quests
  // PATCH /zones/quests/:questId
}
