import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { ZonesModule } from './zones/zones.module';
import { FloorsModule } from './floors/floors.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    ProjectsModule,
    TechnologiesModule,
    ZonesModule,
    FloorsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
