import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Export the supabase client directly
export function useSupabase() {
  return { supabase };
}

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T>(
  query: () => Promise<T>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await query();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
}

// Hook for real-time subscriptions
export function useSupabaseSubscription<T>(
  table: string,
  column: string,
  value: string,
  callback: (payload: any) => void,
) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: column ? `${column}=eq.${value}` : undefined,
        },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [table, column, value, callback]);
}
