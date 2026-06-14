import { Cylinder, SensorData } from '../types/index';

/**
 * Simulates realistic IoT sensor readings for a cylinder
 * Takes into account flow rate, current level, and adds noise
 */
export function simulateSensorReadings(cylinder: Cylinder): Omit<SensorData, 'id' | 'cylinder_id' | 'recorded_at'> {
  // Simulate oxygen depletion based on flow rate
  // Flow rate is typically in liters per minute
  // Assume cylinder capacity is in liters, simulate 5-second intervals
  const depletionFactor = (cylinder.flow_rate / 100) * (5 / 60); // Convert to 5-second intervals
  const depletedLevel = Math.max(0, cylinder.current_level - depletionFactor);

  // Add realistic noise to measurements
  const pressureNoise = (Math.random() - 0.5) * 2; // +/- 1 unit
  const temperatureNoise = (Math.random() - 0.5) * 0.5; // +/- 0.25 degrees
  const flowRateNoise = (Math.random() - 0.5) * 0.2; // +/- 0.1 L/min

  // Ensure values stay within realistic ranges
  const newPressure = Math.max(0, Math.min(300, cylinder.pressure + pressureNoise));
  const newTemperature = Math.max(15, Math.min(45, cylinder.temperature + temperatureNoise));
  const newFlowRate = Math.max(0, Math.min(15, cylinder.flow_rate + flowRateNoise));

  // Pressure typically correlates with oxygen level
  // If oxygen is depleted, pressure should drop proportionally
  const normalizedPressure = newPressure * (depletedLevel / 100);

  return {
    oxygen_level: Number(depletedLevel.toFixed(2)),
    pressure: Number(normalizedPressure.toFixed(2)),
    temperature: Number(newTemperature.toFixed(2)),
    flow_rate: Number(newFlowRate.toFixed(2)),
  };
}

/**
 * Updates a cylinder with simulated sensor data
 * Returns the updated cylinder object
 */
export function updateCylinderWithSimulation(cylinder: Cylinder): Cylinder {
  const newReadings = simulateSensorReadings(cylinder);

  return {
    ...cylinder,
    current_level: newReadings.oxygen_level,
    pressure: newReadings.pressure,
    temperature: newReadings.temperature,
    flow_rate: newReadings.flow_rate,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Generates realistic sensor history for a cylinder
 * Useful for testing predictions and analytics
 */
export function generateSensorHistory(cylinder: Cylinder, hours: number = 24): SensorData[] {
  const history: SensorData[] = [];
  const now = new Date();
  const interval = 5 * 60 * 1000; // 5 minutes
  const totalReadings = (hours * 60) / 5;

  let currentCylinder = { ...cylinder };

  for (let i = 0; i < totalReadings; i++) {
    const timestamp = new Date(now.getTime() - (totalReadings - i) * interval);
    const readings = simulateSensorReadings(currentCylinder);

    history.push({
      id: `sim-${i}-${cylinder.id}`,
      cylinder_id: cylinder.id,
      oxygen_level: readings.oxygen_level,
      pressure: readings.pressure,
      temperature: readings.temperature,
      flow_rate: readings.flow_rate,
      recorded_at: timestamp.toISOString(),
    });

    // Update cylinder for next iteration to simulate continuous depletion
    currentCylinder = {
      ...currentCylinder,
      current_level: readings.oxygen_level,
      pressure: readings.pressure,
      temperature: readings.temperature,
      flow_rate: readings.flow_rate,
    };
  }

  return history;
}
