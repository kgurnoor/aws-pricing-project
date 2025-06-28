// src/hooks/useDurations.ts
import { useState, useEffect } from "react";
import { fetchDurations } from "../api/durationApi";

type DurationOption = { label?: string; value?: string };

export function useDurations() {
  const [durations, setDurations] = useState<DurationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    fetchDurations()
      .then(setDurations)
      .catch(() => setError("Failed to fetch durations"))
      .finally(() => setLoading(false));
  }, []);

  return { durations, loading, error };
}
