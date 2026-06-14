import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Cylinder } from '../types/index';

interface UseCylindersOptions {
  hospitalId?: string;
  limit?: number;
}

export function useCylinders(options: UseCylindersOptions = {}) {
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCylinders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('cylinders')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.hospitalId) {
        query = query.eq('hospital_id', options.hospitalId);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setCylinders(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching cylinders:', error);
    } finally {
      setLoading(false);
    }
  }, [options.hospitalId, options.limit]);

  useEffect(() => {
    fetchCylinders();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('cylinders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cylinders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCylinders((prev) => [payload.new as Cylinder, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setCylinders((prev) =>
            prev.map((c) => (c.id === payload.new.id ? (payload.new as Cylinder) : c))
          );
        } else if (payload.eventType === 'DELETE') {
          setCylinders((prev) => prev.filter((c) => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCylinders]);

  const createCylinder = useCallback(
    async (cylinder: Omit<Cylinder, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('cylinders')
          .insert({
            ...cylinder,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        setCylinders((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error creating cylinder:', error);
        throw error;
      }
    },
    []
  );

  const updateCylinder = useCallback(
    async (cylinderId: string, updates: Partial<Cylinder>) => {
      try {
        const { data, error } = await supabase
          .from('cylinders')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cylinderId)
          .select()
          .single();

        if (error) throw error;

        setCylinders((prev) =>
          prev.map((c) => (c.id === cylinderId ? data : c))
        );
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error updating cylinder:', error);
        throw error;
      }
    },
    []
  );

  const deleteCylinder = useCallback(async (cylinderId: string) => {
    try {
      const { error } = await supabase
        .from('cylinders')
        .delete()
        .eq('id', cylinderId);

      if (error) throw error;

      setCylinders((prev) => prev.filter((c) => c.id !== cylinderId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error deleting cylinder:', error);
      throw error;
    }
  }, []);

  const getCylinderById = useCallback(
    (cylinderId: string) => {
      return cylinders.find((c) => c.id === cylinderId) || null;
    },
    [cylinders]
  );

  return {
    cylinders,
    loading,
    error,
    refetch: fetchCylinders,
    createCylinder,
    updateCylinder,
    deleteCylinder,
    getCylinderById,
  };
}
