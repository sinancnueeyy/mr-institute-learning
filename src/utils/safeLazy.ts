import { lazy } from 'react';
import type { ComponentType } from 'react';
import { handleChunkError } from './pwa';

/**
 * A wrapper around React.lazy that automatically catches PWA chunk loading failures
 * and attempts to reload the application once to fetch the latest Service Worker chunks.
 */
export const safeLazy = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  return lazy(async () => {
    try {
      const component = await factory();
      // On successful load, clear the reload flag
      sessionStorage.removeItem('pwa-chunk-reload');
      return component;
    } catch (error) {
      const handled = handleChunkError(error);
      if (handled) {
        // Return a never-resolving promise so the Suspense fallback remains
        // visible while the browser is reloading.
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  });
};
