import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ImageMetadata {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: number;
  data: Uint8Array;
}

/**
 * Convert Uint8Array to blob URL for display
 */
function createBlobUrl(data: Uint8Array, contentType: string): string {
  // Create a new Uint8Array to ensure proper type compatibility
  const arrayBuffer = new ArrayBuffer(data.length);
  const view = new Uint8Array(arrayBuffer);
  view.set(data);
  const blob = new Blob([view], { type: contentType });
  return URL.createObjectURL(blob);
}

/**
 * Hook to list all uploaded images
 * Note: This is a placeholder implementation since the backend interface is not yet defined
 */
export function useListImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ImageMetadata[]>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        // Placeholder: The actual backend method will be available once blob-storage mixin is properly exposed
        // For now, return empty array until backend interface is updated
        console.warn('Backend blob storage methods not yet available in interface');
        return [];
      } catch (error) {
        console.error('Failed to list images:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Refresh every 10 seconds
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
      if (!actor) throw new Error('Actor not initialized');

      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      // Simulate progress for now
      if (onProgress) {
        onProgress(50);
      }

      // Placeholder: The actual backend method will be available once blob-storage mixin is properly exposed
      console.warn('Backend blob storage upload method not yet available in interface');
      
      if (onProgress) {
        onProgress(100);
      }

      // Return a mock result for now
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate and refetch images list
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
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
      if (!actor) throw new Error('Actor not initialized');
      
      // Placeholder: The actual backend method will be available once blob-storage mixin is properly exposed
      console.warn('Backend blob storage delete method not yet available in interface');
      
      return imageId;
    },
    onSuccess: () => {
      // Invalidate and refetch images list
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

/**
 * Helper to convert image data to displayable URL
 */
export function getImageUrl(image: ImageMetadata): string {
  return createBlobUrl(image.data, image.contentType);
}
