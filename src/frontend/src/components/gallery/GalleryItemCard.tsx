import { useState } from 'react';
import { useDeleteImage } from '../../hooks/useQueries';
import type { ImageData } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Download, Trash2, Loader2, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface GalleryItemCardProps {
  image: ImageData;
}

export function GalleryItemCard({ image }: GalleryItemCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteMutation = useDeleteImage();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(image.id);
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Delete failed:', error);
    }
  };

  const isDeleting = deleteMutation.isPending;
  const deleteError = deleteMutation.error;

  return (
    <div className="gallery-item group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={image.url}
          alt={image.filename}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            className="h-10 w-10"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-10 w-10"
                title="Delete"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{image.filename}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              {deleteError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">
                      {deleteError instanceof Error ? deleteError.message : 'Failed to delete image'}
                    </p>
                  </div>
                </div>
              )}
              
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="mt-2 px-1">
        <p className="text-sm font-medium truncate" title={image.filename}>
          {image.filename}
        </p>
        <p className="text-xs text-muted-foreground">
          {(Number(image.size) / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
