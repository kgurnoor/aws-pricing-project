import { useState, useEffect } from 'react';
import { fetchVerifiedPermissionsFile } from '../api/verifiedPermissionsApi';

export function useVerifiedPermissions(file: 'index-version' | 'index-current-version' | 'index-current-region') {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    fetchVerifiedPermissionsFile(file)
      .then(setData)
      .catch(() => setError('Failed to fetch Verified Permissions data'))
      .finally(() => setLoading(false));
  }, [file]);

  return { data, loading, error };
}
