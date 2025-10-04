"use client";

import Image from "next/image";
import { useState } from "react";

interface SmartImageContainerProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  hoverEffect?: boolean;
}

export default function SmartImageContainer({
  src,
  alt,
  priority = false,
  className = "",
  sizes,
  hoverEffect = true,
}: SmartImageContainerProps) {
  const [aspectRatio, setAspectRatio] = useState<string>("4/3");
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const { naturalWidth, naturalHeight } = img;

    // Calculer l'aspect ratio de l'image
    const ratio = naturalWidth / naturalHeight;

    // Définir l'aspect ratio optimal
    if (ratio > 1.7) {
      setAspectRatio("16/9"); // Wide format
    } else if (ratio > 1.4) {
      setAspectRatio("3/2"); // Standard photo
    } else if (ratio > 1.1) {
      setAspectRatio("4/3"); // Slightly wider
    } else if (ratio > 0.9) {
      setAspectRatio("1/1"); // Square
    } else {
      setAspectRatio("3/4"); // Portrait
    }

    setIsLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`
          object-contain object-center w-full h-full
          transition-all duration-300
          ${hoverEffect ? "group-hover:scale-105" : ""}
          ${isLoaded ? "opacity-100" : "opacity-0"}
        `}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
      />

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
