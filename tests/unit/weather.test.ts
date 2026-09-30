import type { Unit, WeatherData } from '../../src/types/weather';
import { mockWeatherData } from '../../src/types/weather.mock';

describe('weather domain contracts', () => {
  it('exposes the supported temperature units', () => {
    const units: Unit[] = ['celsius', 'fahrenheit'];

    expect(units).toHaveLength(2);
  });

  it('provides UI-ready weather data with five forecast days', () => {
    const weatherData: WeatherData = mockWeatherData;

    expect(weatherData.city.name).toBe('São Paulo');
    expect(weatherData.current.temperatureCelsius).toBe(23);
    expect(weatherData.forecast).toHaveLength(5);
    expect(weatherData.forecast[0].date).toBe('2026-09-30');
  });
});
