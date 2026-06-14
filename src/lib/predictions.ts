import { Cylinder, SensorData, Prediction } from '../types/index';

/**
 * Calculates the average consumption rate (percentage per hour) from sensor history
 */
function calculateConsumptionRate(history: SensorData[]): number {
  if (history.length < 2) return 0;

  const sortedHistory = [...history].sort((a, b) =>
    new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const firstReading = sortedHistory[0];
  const lastReading = sortedHistory[sortedHistory.length - 1];

  const levelDifference = firstReading.oxygen_level - lastReading.oxygen_level;
  const timeDifferenceMs = new Date(lastReading.recorded_at).getTime() - new Date(firstReading.recorded_at).getTime();
  const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

  if (timeDifferenceHours === 0) return 0;

  return levelDifference / timeDifferenceHours;
}

/**
 * Determines the consumption trend by analyzing recent data
 */
function getConsumptionTrend(
  history: SensorData[]
): 'increasing' | 'stable' | 'decreasing' {
  if (history.length < 10) return 'stable';

  const sortedHistory = [...history].sort((a, b) =>
    new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const midPoint = Math.floor(sortedHistory.length / 2);
  const firstHalf = sortedHistory.slice(0, midPoint);
  const secondHalf = sortedHistory.slice(midPoint);

  const firstHalfRate = calculateConsumptionRate(firstHalf);
  const secondHalfRate = calculateConsumptionRate(secondHalf);

  const percentageDifference = ((secondHalfRate - firstHalfRate) / firstHalfRate) * 100;

  if (percentageDifference > 10) {
    return 'increasing';
  } else if (percentageDifference < -10) {
    return 'decreasing';
  } else {
    return 'stable';
  }
}

/**
 * Generates a prediction for when a cylinder will need refilling
 */
export function generatePrediction(cylinder: Cylinder, history: SensorData[]): Prediction {
  const consumptionRate = calculateConsumptionRate(history);
  const currentLevel = cylinder.current_level;

  // Calculate days remaining at current consumption rate
  let daysRemaining = 0;
  if (consumptionRate > 0) {
    // Assume we want to refill at 20% level (low threshold)
    const levelToConsume = currentLevel - 20;
    const hoursToEmpty = levelToConsume / consumptionRate;
    daysRemaining = Math.ceil(hoursToEmpty / 24);
  }

  // Calculate refill date (assume we want to refill at 20% or in 70% of available time)
  const refillDays = Math.max(1, Math.ceil(daysRemaining * 0.7));
  const refillDate = new Date();
  refillDate.setDate(refillDate.getDate() + refillDays);

  // Calculate expected empty date
  const emptyDays = daysRemaining || 30; // Default to 30 days if no consumption
  const emptyDate = new Date();
  emptyDate.setDate(emptyDate.getDate() + emptyDays);

  // Calculate future demand based on trend and current consumption
  const trend = getConsumptionTrend(history);
  let demandMultiplier = 1;
  if (trend === 'increasing') {
    demandMultiplier = 1.2;
  } else if (trend === 'decreasing') {
    demandMultiplier = 0.8;
  }

  const futureDemand = consumptionRate * 24 * demandMultiplier; // Daily demand

  return {
    cylinderId: cylinder.id,
    refillDate: refillDate.toISOString().split('T')[0],
    daysRemaining: Math.max(0, daysRemaining),
    consumptionTrend: getConsumptionTrend(history),
    expectedEmptyDate: emptyDate.toISOString().split('T')[0],
    futureDemand: Number(futureDemand.toFixed(2)),
  };
}

/**
 * Generates predictions for multiple cylinders
 */
export function generateBulkPredictions(
  cylinders: Cylinder[],
  historyMap: Map<string, SensorData[]>
): Prediction[] {
  return cylinders.map((cylinder) => {
    const history = historyMap.get(cylinder.id) || [];
    return generatePrediction(cylinder, history);
  });
}

/**
 * Calculates the consumption rate in liters per hour from sensor history
 * Takes into account the cylinder capacity
 */
export function calculateConsumptionRateInLiters(
  cylinder: Cylinder,
  history: SensorData[]
): number {
  const percentageRate = calculateConsumptionRate(history);
  return (cylinder.capacity / 100) * percentageRate;
}

/**
 * Estimates oxygen demand for a given time period (in days)
 */
export function estimateDemand(
  cylinder: Cylinder,
  history: SensorData[],
  days: number
): number {
  const consumptionRate = calculateConsumptionRateInLiters(cylinder, history);
  return consumptionRate * 24 * days; // Convert hourly to daily and multiply by days
}
