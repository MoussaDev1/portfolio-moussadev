import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Upload une seule image
   * POST /api/upload/image
   * Body: multipart/form-data avec champ 'file'
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validation du type de fichier
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      );
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        'projects/thumbnails',
      );
      return {
        success: true,
        url: result.url,
        publicId: result.publicId,
      };
    } catch (error: unknown) {
      let message: string;
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'Unknown error';
      }
      throw new BadRequestException(`Upload failed: ${message}`);
    }
  }

  /**
   * Upload une icône de technologie
   * POST /api/upload/tech-icon
   * Body: multipart/form-data avec champ 'file'
   */
  @Post('tech-icon')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTechIcon(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validation du type de fichier
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.',
      );
    }

    // Validation de la taille (max 2MB pour les icônes)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 2MB limit');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        'technologies/icons',
      );
      return {
        success: true,
        url: result.url,
        publicId: result.publicId,
      };
    } catch (error: unknown) {
      let message: string;
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'Unknown error';
      }
      throw new BadRequestException(`Upload failed: ${message}`);
    }
  }

  /**
   * Upload plusieurs images (galerie)
   * POST /api/upload/gallery
   * Body: multipart/form-data avec champ 'files' (multiple)
   */
  @Post('gallery')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 images
  async uploadGallery(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Validation
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    const maxSize = 5 * 1024 * 1024;

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type for ${file.originalname}`,
        );
      }
      if (file.size > maxSize) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds 5MB limit`,
        );
      }
    }

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(
        files,
        'projects/gallery',
      );
      return {
        success: true,
        images: results,
      };
    } catch (error: unknown) {
      let message: string;
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'Unknown error';
      }
      throw new BadRequestException(`Upload failed: ${message}`);
    }
  }
}
