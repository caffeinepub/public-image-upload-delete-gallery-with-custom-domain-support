import { useState, useEffect } from 'react';
import { Trash2, Download, Calendar, HardDrive } from 'lucide-react';
import { useDeleteImage, getImageUrl } from '../../hooks/useQueries';
import type { ImageMetadata } from '../../hooks/useQueries';

interface GalleryItemCardProps {
  image: ImageMetadata;
}

export function GalleryItemCard({ image }: GalleryItemCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const deleteMutation = useDeleteImage();

  // Create blob URL for the image
  useEffect(() => {
    const url = getImageUrl(image);
    setImageUrl(url);
    
    // Cleanup blob URL on unmount
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [image]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(image.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const isDeleting = deleteMutation.isPending;

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="aspect-square bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={image.filename}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold text-sm truncate mb-2">{image.filename}</h3>
          <div className="flex items-center gap-4 text-xs text-white/80 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(image.uploadedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>{formatSize(image.size)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={imageUrl}
              download={image.filename}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-destructive/80 hover:bg-destructive backdrop-blur-sm rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full border border-border shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Image?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete "{image.filename}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
