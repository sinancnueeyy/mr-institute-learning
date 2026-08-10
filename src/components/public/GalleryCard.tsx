import { SlideIn } from '../animations/SlideIn';
import { Badge } from '../ui/Badge';
import { Maximize2 } from 'lucide-react';
import type { GalleryContent } from '../../types/cms';

export interface GalleryCardProps {
  item: GalleryContent;
  delay?: number;
}

export function GalleryCard({ item, delay = 0 }: GalleryCardProps) {
  return (
    <SlideIn delay={delay} duration={0.4} direction="up">
      <div className="group relative overflow-hidden rounded-md aspect-[4/3] cursor-pointer">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
          <div className="flex justify-end">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-brand-primary font-semibold">
              {item.category}
            </Badge>
          </div>
          <div className="flex justify-between items-end">
            <h3 className="text-white font-bold text-lg">{item.title}</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-brand-primary transition-colors">
              <Maximize2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </SlideIn>
  );
}
