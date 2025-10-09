import { Module } from '@nestjs/common';
import { FloorsController, ProjectFloorsController } from './floors.controller';
import { FloorsService } from './floors.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FloorsController, ProjectFloorsController],
  providers: [FloorsService],
  exports: [FloorsService],
})
export class FloorsModule {}
