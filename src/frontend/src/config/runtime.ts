export interface RuntimeConfig {
  backendCanisterId: string;
  host?: string;
}

/**
 * Runtime configuration that works with both default canister URLs and custom domains.
 * Derives settings from environment variables and current browser origin.
 */
export function getRuntimeConfig(): RuntimeConfig {
  // Get canister ID from environment
  const backendCanisterId = import.meta.env.VITE_BACKEND_CANISTER_ID || 
                           import.meta.env.CANISTER_ID_BACKEND || 
                           '';

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
    // This allows the app to work on custom domains without hardcoded URLs
    host = window.location.origin.includes('localhost') 
      ? 'http://localhost:4943'
      : undefined; // undefined uses the current origin
  }

  return {
    backendCanisterId,
    host
  };
}
