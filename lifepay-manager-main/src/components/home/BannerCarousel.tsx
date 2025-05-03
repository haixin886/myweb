
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

interface Banner {
  id: number;
  image: string;
  alt: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

export const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Make sure all banner images are preloaded before showing the carousel
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    
    // Reset loaded state when banners change
    setIsLoaded(false);
    setLoadedImages([]);
    
    // Preload all images
    banners.forEach((banner) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => {
          const newLoaded = [...prev, banner.id];
          // When all images are loaded, set isLoaded to true
          if (newLoaded.length === banners.length) {
            setIsLoaded(true);
          }
          return newLoaded;
        });
      };
      img.onerror = (e) => {
        console.error(`Failed to load image ${banner.image}:`, e);
      };
      img.src = banner.image;
    });
  }, [banners]);

  // If images aren't loaded yet, show a loading placeholder
  if (!isLoaded) {
    return (
      <div className="bg-white">
        <div className="w-full h-44 bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Carousel 
        opts={{
          align: "start",
          loop: true
        }} 
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map(banner => (
            <CarouselItem key={banner.id}>
              <img 
                src={banner.image} 
                alt={banner.alt}
                className="w-full h-44 object-cover rounded-xl"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden" />
        <CarouselNext className="hidden" />
      </Carousel>
    </div>
  );
};
