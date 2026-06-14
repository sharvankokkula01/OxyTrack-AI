import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Cylinder, Alert, DashboardStats } from '../types/index';
import { updateCylinderWithSimulation } from '../lib/simulation';
import { getStatusFromLevel } from '../lib/utils';
import { STATUS_THRESHOLDS } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { useNotifications, OxygenAlertLevel } from './NotificationContext';

interface SimulationContextType {
  cylinders: Cylinder[];
  setCylinders: (cylinders: Cylinder[]) => void;
  updateCylinderSimulation: (cylinderId: string) => Promise<void>;
  isSimulating: boolean;
  setIsSimulating: (isSimulating: boolean) => void;
  stats: DashboardStats;
  recentAlerts: Alert[];
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const { addPopup } = useNotifications();
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const previousLevelsRef = useRef<Record<string, number>>({});

  // Calculate dashboard stats from cylinders
  const stats: DashboardStats = {
    total: cylinders.length,
    active: cylinders.filter((c) => c.status !== 'emergency').length,
    full: cylinders.filter((c) => c.status === 'full').length,
    medium: cylinders.filter((c) => c.status === 'medium').length,
    low: cylinders.filter((c) => c.status === 'low').length,
    critical: cylinders.filter((c) => c.status === 'critical').length,
    emergency: cylinders.filter((c) => c.status === 'emergency').length,
    refillPending: cylinders.filter((c) => c.status === 'low' || c.status === 'critical').length,
    consumptionRate: calculateAverageConsumption(cylinders),
    utilizationPercent: calculateUtilization(cylinders),
  };

  function calculateAverageConsumption(cyls: Cylinder[]): number {
    if (cyls.length === 0) return 0;
    const totalConsumption = cyls.reduce((sum, c) => sum + c.flow_rate, 0);
    return Number((totalConsumption / cyls.length).toFixed(2));
  }

  function calculateUtilization(cyls: Cylinder[]): number {
    if (cyls.length === 0) return 0;
    const totalCapacity = cyls.reduce((sum, c) => sum + c.capacity, 0);
    const totalUsed = cyls.reduce((sum, c) => sum + c.current_level, 0);
    const average = totalUsed / cyls.length;
    return Number((average).toFixed(2));
  }

  const updateCylinderSimulation = useCallback(
    async (cylinderId: string) => {
      const cylinder = cylinders.find((c) => c.id === cylinderId);
      if (!cylinder) return;

      const updatedCylinder = updateCylinderWithSimulation(cylinder);
      const newStatus = getStatusFromLevel(updatedCylinder.current_level);
      const previousLevel = previousLevelsRef.current[cylinderId] ?? cylinder.current_level;

      // Check oxygen thresholds for popup notifications
      const checkAndTriggerAlert = async (currentLevel: number) => {
        let alertTriggered = false;
        let alertLevel: OxygenAlertLevel | null = null;
        let alertSeverity: string | null = null;
        let alertType: 'emergency_oxygen' | 'critical_oxygen' | 'low_oxygen' | null = null;

        // Emergency threshold < 10%
        if (currentLevel < 10 && previousLevel >= 10) {
          alertTriggered = true;
          alertLevel = 'emergency_oxygen';
          alertType = 'emergency_oxygen';
          alertSeverity = 'emergency';
        }
        // Critical threshold < 15% (and not already in emergency)
        else if (currentLevel < 15 && previousLevel >= 15 && currentLevel >= 10) {
          alertTriggered = true;
          alertLevel = 'critical_oxygen';
          alertType = 'critical_oxygen';
          alertSeverity = 'critical';
        }
        // Low threshold < 30% (and not already critical/emergency)
        else if (currentLevel < 30 && previousLevel >= 30 && currentLevel >= 15) {
          alertTriggered = true;
          alertLevel = 'low_oxygen';
          alertType = 'low_oxygen';
          alertSeverity = 'warning';
        }

        if (alertTriggered && alertLevel && alertType) {
          // Add popup
          addPopup({
            level: alertLevel,
            cylinderId: cylinder.cylinder_id,
            currentLevel: Math.round(currentLevel),
            ward: cylinder.ward,
          });

          // Store in alerts table
          try {
            await supabase.from('alerts').insert({
              cylinder_id: cylinderId,
              hospital_id: updatedCylinder.hospital_id,
              alert_type: alertType,
              severity: alertSeverity,
              message: `Oxygen level ${Math.round(currentLevel)}% in ${cylinder.ward}`,
              is_read: false,
              is_resolved: false,
              assigned_to: null,
            });
          } catch (error) {
            console.error('Error creating alert:', error);
          }
        }
      };

      await checkAndTriggerAlert(updatedCylinder.current_level);

      // Track previous level for this cylinder
      previousLevelsRef.current[cylinderId] = updatedCylinder.current_level;

      // Update cylinder in state
      setCylinders((prev) =>
        prev.map((c) =>
          c.id === cylinderId
            ? {
                ...updatedCylinder,
                status: newStatus,
              }
            : c
        )
      );
    },
    [cylinders, addPopup]
  );

  // Simulation loop
  useEffect(() => {
    if (!isSimulating || cylinders.length === 0) return;

    const interval = setInterval(() => {
      cylinders.forEach((cylinder) => {
        updateCylinderSimulation(cylinder.id).catch(console.error);
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isSimulating, cylinders, updateCylinderSimulation]);

  // Fetch recent alerts
  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const { data } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (data) {
          setRecentAlerts(data);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchRecentAlerts();

    const channel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
        setRecentAlerts((prev) => [payload.new as Alert, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value: SimulationContextType = {
    cylinders,
    setCylinders,
    updateCylinderSimulation,
    isSimulating,
    setIsSimulating,
    stats,
    recentAlerts,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextType {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
