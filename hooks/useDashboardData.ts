import { supabase } from '@/lib/supabase/supabase';
import { useEffect, useState } from 'react';

export function useDashboardData() {
  const [data, setData] = useState({
    members: { total: 0, loading: true },
    revenue: { amount: 0, loading: true },
    classes: { count: 0, loading: true },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, revenueData, classesData] = await Promise.all([
          supabase.from('member_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('payments').select('amount').gt('created_at', 'now() - 30d'),
          supabase.from('classes').select('*', { count: 'exact', head: true }),
        ]);

        setData({
          members: { total: membersData.count || 0, loading: false },
          revenue: {
            amount: revenueData.data?.reduce((a, b) => a + b.amount, 0) || 0,
            loading: false,
          },
          classes: { count: classesData.count || 0, loading: false },
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return data;
}
