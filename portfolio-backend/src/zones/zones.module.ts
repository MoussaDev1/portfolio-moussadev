import { Module } from '@nestjs/common';
import { ZonesController, ProjectZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ZonesController, ProjectZonesController],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZonesModule {}
