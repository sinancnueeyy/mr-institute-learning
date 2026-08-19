export const handleChunkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Detect standard chunk load errors from various browsers/bundlers
    const isChunkError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('dynamically imported module') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const isReloaded = sessionStorage.getItem('pwa-chunk-reload');
      if (!isReloaded) {
        // Attempt a hard reload to fetch the new service worker/index.html
        sessionStorage.setItem('pwa-chunk-reload', 'true');
        window.location.reload();
        return true;
      } else {
        // Already attempted reload once, clear flag and let it fail to avoid infinite loops
        sessionStorage.removeItem('pwa-chunk-reload');
      }
    }
  }
  return false;
};
