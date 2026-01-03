import { useState, useCallback } from 'react';

export interface AddressInfo {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface UseReverseGeocodeReturn {
  address: AddressInfo | null;
  loading: boolean;
  error: string | null;
  getAddress: (lat: number, lon: number) => Promise<void>;
}

export function useReverseGeocode(): UseReverseGeocodeReturn {
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddress = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'ro,en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAddress({
        display_name: data.display_name,
        address: data.address,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, loading, error, getAddress };
}
