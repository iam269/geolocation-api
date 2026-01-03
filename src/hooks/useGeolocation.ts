import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  supported: boolean;
  permissionDenied: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  watch: false,
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { enableHighAccuracy, timeout, maximumAge, watch } = {
    ...defaultOptions,
    ...options,
  };

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestamp: null,
    error: null,
    loading: false,
    supported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    permissionDenied: false,
  });

  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState((prev) => ({
      ...prev,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      error: null,
      loading: false,
      permissionDenied: false,
    }));
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      error,
      loading: false,
      permissionDenied: error.code === error.PERMISSION_DENIED,
    }));
  }, []);

  const getPosition = useCallback(() => {
    if (!state.supported) {
      setState((prev) => ({
        ...prev,
        error: {
          code: 0,
          message: 'Geolocation is not supported by this browser',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
  }, [state.supported, handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge]);

  const startWatching = useCallback(() => {
    if (!state.supported || watchIdRef.current !== null) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [state.supported, handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Auto-start watching if watch option is true
  useEffect(() => {
    if (watch && state.supported) {
      startWatching();
    }

    return () => {
      stopWatching();
    };
  }, [watch, state.supported, startWatching, stopWatching]);

  return {
    ...state,
    getPosition,
    startWatching,
    stopWatching,
    isWatching: watchIdRef.current !== null,
  };
}
