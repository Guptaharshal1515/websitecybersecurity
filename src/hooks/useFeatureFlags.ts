import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description?: string;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('name, enabled');

        if (error) throw error;

        const flagsMap = data?.reduce((acc, flag) => {
          acc[flag.name] = flag.enabled;
          return acc;
        }, {} as Record<string, boolean>) || {};

        setFlags(flagsMap);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const isEnabled = (flagName: string): boolean => {
    return flags[flagName] || false;
  };

  return { flags, isEnabled, loading };
};