export const handleChunkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Detect standard chunk load errors from various browsers/bundlers
    const isChunkError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('dynamically imported module') ||
      error.message.includes('Failed to load module script') ||
      error.message.includes('MIME type') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const isReloaded = sessionStorage.getItem('pwa-chunk-reload');
      if (!isReloaded) {
        sessionStorage.setItem('pwa-chunk-reload', 'true');
        // Update service workers to fetch latest manifest before reloading
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
              registration.update();
            }
          }).finally(() => {
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
        return true;
      } else {
        // Already attempted reload once, clear flag and let it fail to avoid infinite loops
        sessionStorage.removeItem('pwa-chunk-reload');
      }
    }
  }
  return false;
};
