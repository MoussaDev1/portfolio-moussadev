"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryCarouselProps {
  images: string[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Main Image Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted shadow-2xl">
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority={currentIndex === 0}
        />

        {/* Navigation Overlay */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg transition-all"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg transition-all"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Counter Badge */}
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-sm font-medium shadow-lg">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Navigation */}
      {images.length > 1 && (
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-105"
                  : "opacity-60 hover:opacity-100 hover:scale-105"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicators (mobile fallback) */}
      {images.length > 1 && images.length <= 5 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
