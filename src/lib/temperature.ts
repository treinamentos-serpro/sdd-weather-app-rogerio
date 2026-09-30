import type { Unit } from '../types/weather';

export function convertTemperature(temperatureCelsius: number, unit: Unit): number {
  if (unit === 'celsius') {
    return Math.round(temperatureCelsius);
  }

  return Math.round((temperatureCelsius * 9) / 5 + 32);
}
