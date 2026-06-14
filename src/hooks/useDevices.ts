import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Device, DeviceStatus } from '../types/index';

interface UseDevicesOptions {
  cylinderId?: string;
  status?: DeviceStatus;
  limit?: number;
}

export function useDevices(options: UseDevicesOptions = {}) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('devices')
        .select('*')
        .order('last_communication', { ascending: false });

      if (options.cylinderId) {
        query = query.eq('cylinder_id', options.cylinderId);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setDevices(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  }, [options.cylinderId, options.status, options.limit]);

  useEffect(() => {
    fetchDevices();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('devices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDevices((prev) => [payload.new as Device, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setDevices((prev) =>
            prev.map((d) => (d.id === payload.new.id ? (payload.new as Device) : d))
          );
        } else if (payload.eventType === 'DELETE') {
          setDevices((prev) => prev.filter((d) => d.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDevices]);

  const createDevice = useCallback(
    async (device: Omit<Device, 'id'>) => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .insert(device)
          .select()
          .single();

        if (error) throw error;

        setDevices((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error creating device:', error);
        throw error;
      }
    },
    []
  );

  const updateDevice = useCallback(
    async (deviceId: string, updates: Partial<Device>) => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .update(updates)
          .eq('id', deviceId)
          .select()
          .single();

        if (error) throw error;

        setDevices((prev) =>
          prev.map((d) => (d.id === deviceId ? data : d))
        );
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error updating device:', error);
        throw error;
      }
    },
    []
  );

  const updateDeviceStatus = useCallback(
    async (deviceId: string, status: DeviceStatus) => {
      return updateDevice(deviceId, { status });
    },
    [updateDevice]
  );

  const updateLastCommunication = useCallback(
    async (deviceId: string) => {
      return updateDevice(deviceId, {
        last_communication: new Date().toISOString(),
      });
    },
    [updateDevice]
  );

  const updateBatteryLevel = useCallback(
    async (deviceId: string, batteryLevel: number) => {
      return updateDevice(deviceId, {
        battery_level: Math.min(100, Math.max(0, batteryLevel)),
      });
    },
    [updateDevice]
  );

  const updateFirmwareVersion = useCallback(
    async (deviceId: string, version: string) => {
      return updateDevice(deviceId, {
        firmware_version: version,
      });
    },
    [updateDevice]
  );

  const deleteDevice = useCallback(async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;

      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error deleting device:', error);
      throw error;
    }
  }, []);

  const getDeviceById = useCallback(
    (deviceId: string) => {
      return devices.find((d) => d.id === deviceId) || null;
    },
    [devices]
  );

  const getDevicesByCylinder = useCallback(
    (cylinderId: string) => {
      return devices.filter((d) => d.cylinder_id === cylinderId);
    },
    [devices]
  );

  const getOfflineDevices = useCallback(() => {
    return devices.filter((d) => d.status === 'offline');
  }, [devices]);

  const getLowBatteryDevices = useCallback((threshold: number = 20) => {
    return devices.filter((d) => d.battery_level <= threshold);
  }, [devices]);

  return {
    devices,
    loading,
    error,
    refetch: fetchDevices,
    createDevice,
    updateDevice,
    updateDeviceStatus,
    updateLastCommunication,
    updateBatteryLevel,
    updateFirmwareVersion,
    deleteDevice,
    getDeviceById,
    getDevicesByCylinder,
    getOfflineDevices,
    getLowBatteryDevices,
  };
}
