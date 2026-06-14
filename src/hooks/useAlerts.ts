import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Alert, AlertSeverity, AlertType } from '../types/index';

interface UseAlertsOptions {
  hospitalId?: string;
  cylinderId?: string;
  severity?: AlertSeverity;
  isResolved?: boolean;
  limit?: number;
}

export function useAlerts(options: UseAlertsOptions = {}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.hospitalId) {
        query = query.eq('hospital_id', options.hospitalId);
      }

      if (options.cylinderId) {
        query = query.eq('cylinder_id', options.cylinderId);
      }

      if (options.severity) {
        query = query.eq('severity', options.severity);
      }

      if (options.isResolved !== undefined) {
        query = query.eq('is_resolved', options.isResolved);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setAlerts(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  }, [options.hospitalId, options.cylinderId, options.severity, options.isResolved, options.limit]);

  useEffect(() => {
    fetchAlerts();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAlerts((prev) => [payload.new as Alert, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setAlerts((prev) =>
            prev.map((a) => (a.id === payload.new.id ? (payload.new as Alert) : a))
          );
        } else if (payload.eventType === 'DELETE') {
          setAlerts((prev) => prev.filter((a) => a.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAlerts]);

  const createAlert = useCallback(
    async (alert: Omit<Alert, 'id' | 'created_at' | 'resolved_at'>) => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .insert({
            ...alert,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        setAlerts((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error creating alert:', error);
        throw error;
      }
    },
    []
  );

  const updateAlert = useCallback(
    async (alertId: string, updates: Partial<Alert>) => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .update(updates)
          .eq('id', alertId)
          .select()
          .single();

        if (error) throw error;

        setAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? data : a))
        );
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error updating alert:', error);
        throw error;
      }
    },
    []
  );

  const markAsRead = useCallback(async (alertId: string) => {
    return updateAlert(alertId, { is_read: true });
  }, [updateAlert]);

  const resolveAlert = useCallback(async (alertId: string) => {
    return updateAlert(alertId, {
      is_resolved: true,
      resolved_at: new Date().toISOString(),
    });
  }, [updateAlert]);

  const assignAlert = useCallback(
    async (alertId: string, userId: string) => {
      return updateAlert(alertId, { assigned_to: userId });
    },
    [updateAlert]
  );

  const deleteAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error deleting alert:', error);
      throw error;
    }
  }, []);

  const getUnresolvedAlerts = useCallback(() => {
    return alerts.filter((a) => !a.is_resolved);
  }, [alerts]);

  const getUnreadAlerts = useCallback(() => {
    return alerts.filter((a) => !a.is_read);
  }, [alerts]);

  const getAlertsBySeverity = useCallback(
    (severity: AlertSeverity) => {
      return alerts.filter((a) => a.severity === severity);
    },
    [alerts]
  );

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
    createAlert,
    updateAlert,
    markAsRead,
    resolveAlert,
    assignAlert,
    deleteAlert,
    getUnresolvedAlerts,
    getUnreadAlerts,
    getAlertsBySeverity,
  };
}
