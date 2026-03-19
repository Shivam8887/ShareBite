import { useState, useEffect, useCallback } from 'react';

// Lucknow fallback coordinates
const FALLBACK_COORDS = { lat: 26.8467, lng: 80.9462 };

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

/**
 * Custom hook for browser geolocation with high accuracy,
 * proper error handling, and Lucknow fallback.
 */
export function useGeolocation() {
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Parse geolocation errors into user-friendly messages
  const getErrorMessage = (err) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return 'Location permission denied. Please allow location access in your browser settings.';
      case err.POSITION_UNAVAILABLE:
        return 'Location information is unavailable. Using default location.';
      case err.TIMEOUT:
        return 'Location request timed out. Using default location.';
      default:
        return 'An unknown error occurred while fetching location.';
    }
  };

  const applyFallback = useCallback((errorMessage) => {
    console.warn('[useGeolocation] Falling back to Lucknow coordinates:', FALLBACK_COORDS);
    setPosition(FALLBACK_COORDS);
    setError(errorMessage);
    setUsingFallback(true);
    setLoading(false);
  }, []);

  // Manual re-fetch function
  const refetch = useCallback(() => {
    if (!navigator.geolocation) {
      applyFallback('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    setUsingFallback(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        console.log('[useGeolocation] Got position:', { lat, lng });
        console.log(`[useGeolocation] Accuracy: ${pos.coords.accuracy}m`);
        setPosition({ lat, lng });
        setUsingFallback(false);
        setError(null);
        setLoading(false);
      },
      (err) => {
        const message = getErrorMessage(err);
        console.error('[useGeolocation] Error:', err.code, err.message);
        applyFallback(message);
      },
      GEOLOCATION_OPTIONS
    );
  }, [applyFallback]);

  // Initial fetch on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      applyFallback('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        console.log('[useGeolocation] Initial position:', { lat, lng });
        console.log(`[useGeolocation] Accuracy: ${pos.coords.accuracy}m`);
        setPosition({ lat, lng });
        setLoading(false);
      },
      (err) => {
        const message = getErrorMessage(err);
        console.error('[useGeolocation] Initial error:', err.code, err.message);
        applyFallback(message);
      },
      GEOLOCATION_OPTIONS
    );
  }, [applyFallback]);

  return { position, error, loading, usingFallback, refetch };
}
