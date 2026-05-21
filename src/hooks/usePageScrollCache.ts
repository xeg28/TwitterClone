
import { useEffect, useCallback } from 'react';

/**
 * usePageScrollCache
 * Caches and restores scroll position for a given key (e.g., pathname).
 * Uses sessionStorage for persistence across reloads and navigation.
 * Optionally, call with a dataLoaded boolean to restore scroll after data fetch.
 */
export function usePageScrollCache(key: string) {
  // Save scroll position to sessionStorage
  const saveScroll = useCallback(() => {
    if (!key) return;
    sessionStorage.setItem(`scroll-pos:${key}`, String(window.scrollY));
  }, [key]);

  // Restore scroll position from sessionStorage
  const restoreScroll = useCallback(() => {
    if (!key) return;
    const pos = sessionStorage.getItem(`scroll-pos:${key}`);
    sessionStorage.removeItem(`scroll-pos:${key}`);
    if (pos) {
      const doc = document.documentElement;
      doc.scrollTo(0, +pos);
      console.log(pos);
    }
  }, [key]);



  return { saveScroll, restoreScroll };
}

