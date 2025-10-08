import { Test, TestingModule } from '@nestjs/testing';
import { ZonesService } from './zones.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ZonesService', () => {
  let service: ZonesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZonesService, PrismaService],
    }).compile();

    service = module.get<ZonesService>(ZonesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllZones', () => {
    it('should return all zones', async () => {
      const mockZones = [
        { id: '1', name: 'Zone 1' },
        { id: '2', name: 'Zone 2' },
      ];
      prisma.zone.findMany = jest.fn().mockResolvedValue(mockZones);

      const result = await service.findAllZones();
      expect(result).toEqual(mockZones);
      expect(prisma.zone.findMany).toHaveBeenCalled();
    });
  });

  describe('findZoneById', () => {
    it('should return a zone by ID', async () => {
      const mockZone = { id: '1', name: 'Zone 1' };
      prisma.zone.findUnique = jest.fn().mockResolvedValue(mockZone);

      const result = await service.findZoneById('1');
      expect(result).toEqual(mockZone);
      expect(prisma.zone.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { project: true, quests: { orderBy: { createdAt: 'asc' } } },
      });
    });

    it('should throw NotFoundException if zone not found', async () => {
      prisma.zone.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findZoneById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Add more tests for other methods
});
