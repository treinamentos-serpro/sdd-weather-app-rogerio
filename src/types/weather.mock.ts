import type { WeatherData } from './weather';

export const mockWeatherData: WeatherData = {
  city: {
    name: 'São Paulo',
    region: 'São Paulo',
    country: 'Brasil',
    latitude: -23.55052,
    longitude: -46.63331,
  },
  timezone: 'America/Sao_Paulo',
  current: {
    observedAt: '2026-09-30T12:00:00-03:00',
    temperatureCelsius: 23,
    apparentTemperatureCelsius: 24,
    relativeHumidity: 64,
    windSpeedKmh: 11,
    precipitationMm: 0,
    pressureHpa: 1012,
    weatherCode: 2,
  },
  forecast: [
    {
      date: '2026-09-30',
      minimumCelsius: 17,
      maximumCelsius: 25,
      precipitationProbability: 10,
      weatherCode: 2,
    },
    {
      date: '2026-10-01',
      minimumCelsius: 18,
      maximumCelsius: 26,
      precipitationProbability: 5,
      weatherCode: 1,
    },
    {
      date: '2026-10-02',
      minimumCelsius: 19,
      maximumCelsius: 27,
      precipitationProbability: 20,
      weatherCode: 3,
    },
    {
      date: '2026-10-03',
      minimumCelsius: 18,
      maximumCelsius: 24,
      precipitationProbability: 70,
      weatherCode: 61,
    },
    {
      date: '2026-10-04',
      minimumCelsius: 17,
      maximumCelsius: 23,
      precipitationProbability: 80,
      weatherCode: 80,
    },
  ],
};
