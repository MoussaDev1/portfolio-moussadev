import Image from "next/image";

interface CloudinaryImageProps {
  publicId: string; // ex: "projects/netflix-clone"
  alt: string;
  width: number;
  height: number;
  className?: string;
  transformations?: string; // ex: "w_800,h_600,c_fill,f_auto,q_auto"
}

/**
 * Composant pour afficher des images hébergées sur Cloudinary
 * avec optimisations automatiques (WebP, compression, etc.)
 *
 * @example
 * <CloudinaryImage
 *   publicId="projects/netflix-clone"
 *   alt="Netflix Clone"
 *   width={800}
 *   height={600}
 *   transformations="w_800,h_600,c_fill,f_auto,q_auto"
 *   className="rounded-lg"
 * />
 */
export default function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className = "",
  transformations = "f_auto,q_auto", // Format auto + qualité auto par défaut
}: CloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined in environment variables",
    );
    return null;
  }

  // Construire l'URL Cloudinary
  const src = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
}
