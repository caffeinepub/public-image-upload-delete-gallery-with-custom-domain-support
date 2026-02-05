export interface RuntimeConfig {
  backendCanisterId: string;
  host?: string;
}

/**
 * Runtime configuration that works with both default canister URLs and custom domains.
 * 
 * This configuration automatically adapts to different deployment scenarios:
 * - Development: Uses local replica at localhost:4943
 * - Production (IC mainnet): Uses ic0.app host
 * - Custom domain: Derives host from current browser origin
 * 
 * For a fresh deployment:
 * 1. Ensure VITE_BACKEND_CANISTER_ID is set to your backend canister ID
 * 2. Set VITE_DFX_NETWORK=ic for mainnet deployments
 * 3. For custom domains, register your domain with the IC boundary node
 * 
 * See DEPLOYMENT.md and CUSTOM_DOMAIN.md for detailed setup instructions.
 */
export function getRuntimeConfig(): RuntimeConfig {
  // Get canister ID from environment variables
  // These are automatically set by DFX during deployment
  const backendCanisterId = import.meta.env.VITE_BACKEND_CANISTER_ID || 
                           import.meta.env.CANISTER_ID_BACKEND || 
                           '';

  if (!backendCanisterId) {
    console.warn('Backend canister ID not configured. Set VITE_BACKEND_CANISTER_ID environment variable.');
  }

  // Determine host based on environment
  let host: string | undefined;
  
  if (import.meta.env.DEV) {
    // Development: use local replica
    host = 'http://localhost:4943';
  } else if (import.meta.env.VITE_DFX_NETWORK === 'ic') {
    // Production on IC mainnet: use default IC host
    host = 'https://ic0.app';
  } else {
    // Custom domain or other deployment: derive from current origin
    // When host is undefined, the agent uses window.location.origin
    // This allows the app to work seamlessly on custom domains
    host = window.location.origin.includes('localhost') 
      ? 'http://localhost:4943'
      : undefined;
  }

  return {
    backendCanisterId,
    host
  };
}
