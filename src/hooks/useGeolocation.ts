import { useState, useCallback } from 'react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
    permissionDenied: false,
  });

  const requestLocation = useCallback(
    (): Promise<Coordinates | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          const err = 'Geolocation is not supported by your current browser.';
          setState({ coords: null, loading: false, error: err, permissionDenied: false });
          resolve(null);
          return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setState({
              coords,
              loading: false,
              error: null,
              permissionDenied: false,
            });
            resolve(coords);
          },
          (error) => {
            let msg = 'Unable to determine your device location.';
            let denied = false;
            if (error.code === error.PERMISSION_DENIED) {
              msg = 'Location permission was denied. You can search any city manually.';
              denied = true;
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              msg = 'Location information is currently unavailable.';
            } else if (error.code === error.TIMEOUT) {
              msg = 'Location request timed out. Please try searching manually.';
            }

            setState({ coords: null, loading: false, error: msg, permissionDenied: denied });
            resolve(null);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes cache
          }
        );
      });
    },
    []
  );

  return {
    ...state,
    requestLocation,
  };
}

