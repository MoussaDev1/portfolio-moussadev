-- AlterTable
ALTER TABLE "floors" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT 'floor-slug';

-- AlterTable
ALTER TABLE "zones" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT 'zone-slug';
