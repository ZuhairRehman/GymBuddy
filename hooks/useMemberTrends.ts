import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface MemberTrendData {
  current: number;
  previous: number;
  trend: {
    value: number;
    isPositive: boolean;
  };
  loading: boolean;
}

export function useMemberTrends() {
  const [data, setData] = useState<MemberTrendData>({
    current: 0,
    previous: 0,
    trend: { value: 0, isPositive: true },
    loading: true,
  });

  useEffect(() => {
    const fetchMemberTrends = async () => {
      try {
        // Fetch current month's renewals or new subscriptions
        const { count: currentCount, error: currentError } = await supabase
          .from('member_profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', "date_trunc('month', now())");

        if (currentError) throw currentError;

        // Fetch previous month's renewals or new subscriptions
        const { count: previousCount, error: previousError } = await supabase
          .from('member_profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', "date_trunc('month', now()) - interval '1 month'")
          .lt('created_at', "date_trunc('month', now())");

        if (previousError) throw previousError;

        // Calculate trend
        const trendValue = previousCount
          ? Math.round(((currentCount - previousCount) / previousCount) * 100)
          : 100; // If no previous data, assume 100% growth
        const isPositive = currentCount >= previousCount;

        // Update state
        setData({
          current: currentCount || 0,
          previous: previousCount || 0,
          trend: { value: trendValue, isPositive },
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching member trends:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMemberTrends();
  }, []);

  return data;
}
