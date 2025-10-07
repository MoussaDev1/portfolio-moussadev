import { Controller } from '@nestjs/common';
import { FloorsService } from './floors.service';

@Controller('floors')
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  // TODO: Implémenter les endpoints floors et floor quests
  // GET /floors/:id
  // PATCH /floors/:id
  // GET /floors/:id/quests
  // POST /floors/:id/quests
  // PATCH /floors/quests/:questId
}
