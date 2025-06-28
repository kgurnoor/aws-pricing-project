import { useState, useEffect } from 'react';
import { fetchAllServices } from '../api/servicesApi';

// Define the structure for better type safety
interface ServicesData {
  offers: Record<string, any>;
  [key: string]: any;
}

export function useServices() {
  const [services, setServices] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    fetchAllServices()
      .then(setServices)
      .catch(() => setError('Failed to fetch services'))
      .finally(() => setLoading(false));
  }, []);

  return { services, loading, error };
}
