import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface BlobMetadata {
  id: string;
  filename: string;
  contentType: string;
  size: bigint;
  uploadedAt: bigint;
}

export interface ImageData extends BlobMetadata {
  url: string;
}

/**
 * Hook to list all uploaded images
 */
export function useListImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ImageData[]>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Backend connection not initialized');
      }

      const actorAny = actor as any;
      
      // Check if the required methods exist
      if (typeof actorAny.listBlobs !== 'function') {
        throw new Error('Backend blob storage API not available. Please redeploy the canister.');
      }

      const metadataList = await actorAny.listBlobs();
      
      if (!Array.isArray(metadataList)) {
        return [];
      }
      
      // Fetch blob data for each metadata entry
      const images = await Promise.all(
        metadataList.map(async (meta: any) => {
          try {
            const data = await actorAny.getBlob(meta.id);
            
            // Convert blob data to URL for display
            const blob = new Blob([new Uint8Array(data)], { 
              type: meta.contentType || 'application/octet-stream' 
            });
            const url = URL.createObjectURL(blob);
            
            return {
              id: meta.id,
              filename: meta.filename,
              contentType: meta.contentType,
              size: BigInt(meta.size),
              uploadedAt: BigInt(meta.uploadedAt),
              url,
            };
          } catch (error) {
            console.error(`Failed to fetch blob ${meta.id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out failed fetches
      return images.filter((img): img is ImageData => img !== null);
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    retryDelay: 1000,
  });
}

/**
 * Hook to upload an image
 */
export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      file, 
      onProgress 
    }: { 
      file: File; 
      onProgress?: (percentage: number) => void;
    }) => {
      if (!actor) {
        throw new Error('Backend connection not initialized');
      }

      const actorAny = actor as any;
      
      // Check if the required methods exist
      if (typeof actorAny.storeBlob !== 'function') {
        throw new Error('Backend blob storage API not available. Please redeploy the canister.');
      }

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      if (onProgress) {
        onProgress(25);
      }

      // Store blob with metadata
      const id = await actorAny.storeBlob(bytes, {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
      });

      if (onProgress) {
        onProgress(100);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    retry: 1,
  });
}

/**
 * Hook to delete an image
 */
export function useDeleteImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      if (!actor) {
        throw new Error('Backend connection not initialized');
      }
      
      const actorAny = actor as any;
      
      // Check if the required methods exist
      if (typeof actorAny.deleteBlob !== 'function') {
        throw new Error('Backend blob storage API not available. Please redeploy the canister.');
      }
      
      const success = await actorAny.deleteBlob(imageId);
      
      if (!success) {
        throw new Error('Failed to delete image');
      }
      
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    retry: 1,
  });
}
