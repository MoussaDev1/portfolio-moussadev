-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
