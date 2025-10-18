import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Détermine les transformations appropriées selon le type d'image
   */
  private getTransformations(folder: string) {
    // Thumbnails de projets : ratio 16:9, taille optimale
    if (folder.includes('thumbnail')) {
      return [
        { width: 1200, height: 675, crop: 'fill', gravity: 'auto' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ];
    }

    // Icônes de technologies : carré, fond transparent si possible
    if (folder.includes('tech') || folder.includes('icon')) {
      return [
        { width: 256, height: 256, crop: 'fit', background: 'transparent' },
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
      ];
    }

    // Images de galerie : ratio 4:3, taille moyenne
    if (folder.includes('gallery')) {
      return [
        { width: 1024, height: 768, crop: 'fill', gravity: 'auto' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ];
    }

    // Par défaut : limiter la taille sans modifier le ratio
    return [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ];
  }

  /**
   * Upload une image vers Cloudinary depuis un buffer
   * @param file - Fichier uploadé (Express.Multer.File)
   * @param folder - Dossier dans Cloudinary (ex: 'projects/thumbnails')
   * @returns Promise avec l'URL publique et le public_id
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'projects',
  ): Promise<{ url: string; publicId: string }> {
    if (!file || !(file instanceof Object) || !('buffer' in file)) {
      throw new Error('Invalid file or file buffer.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: this.getTransformations(folder),
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('Unknown error during Cloudinary upload.'));
          }
        },
      );

      // Convertir le buffer en stream et l'envoyer à Cloudinary
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }

  /**
   * Upload multiple images to Cloudinary
   * @param files - Array of uploaded files (Express.Multer.File[])
   * @param folder - Folder in Cloudinary (e.g., 'projects/gallery')
   * @returns Promise with an array of uploaded image URLs and public IDs
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'projects',
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Supprime une image de Cloudinary
   * @param publicId - ID public de l'image (ex: 'projects/abc123')
   * @returns Promise avec le résultat de la suppression
   */
  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = (await cloudinary.uploader.destroy(publicId)) as {
        result: string;
      };
      if (result.result !== 'ok') {
        throw new Error(`Failed to delete image with publicId: ${publicId}`);
      }
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete image: ${errorMessage}`);
    }
  }
}
