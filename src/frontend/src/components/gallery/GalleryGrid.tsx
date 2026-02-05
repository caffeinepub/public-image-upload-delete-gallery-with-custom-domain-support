import { useListImages } from '../../hooks/useQueries';
import { GalleryItemCard } from './GalleryItemCard';
import { Loader2, ImageOff, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function GalleryGrid() {
  const { data: images, isLoading, error, refetch } = useListImages();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load gallery';
    const isBackendError = errorMessage.includes('Backend blob storage API not available') || 
                          errorMessage.includes('is not a function');

    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-medium text-destructive mb-1">
                Failed to Load Gallery
              </p>
              <p className="text-xs text-destructive/90">
                {isBackendError 
                  ? 'The backend canister needs to be redeployed with blob storage support.'
                  : errorMessage}
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="border-destructive/50 hover:bg-destructive/20"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageOff className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-1">No images yet</h3>
        <p className="text-sm text-muted-foreground">
          Upload your first image to get started
        </p>
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
