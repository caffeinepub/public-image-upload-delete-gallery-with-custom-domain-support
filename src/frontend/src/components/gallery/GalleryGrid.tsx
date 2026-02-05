import { Loader2, ImageOff } from 'lucide-react';
import { useListImages } from '../../hooks/useQueries';
import { GalleryItemCard } from './GalleryItemCard';

export function GalleryGrid() {
  const { data: images, isLoading, error } = useListImages();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-4 bg-destructive/10 rounded-full mb-4">
          <ImageOff className="h-12 w-12 text-destructive" />
        </div>
        <p className="text-destructive font-medium mb-2">Failed to load images</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-4 bg-muted rounded-full mb-4">
          <ImageOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold mb-2">No images yet</p>
        <p className="text-sm text-muted-foreground">Upload your first image to get started</p>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {images.map((image) => (
        <GalleryItemCard key={image.id} image={image} />
      ))}
    </div>
  );
}
