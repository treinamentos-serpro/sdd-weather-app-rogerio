import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useWeather } from '../../src/hooks/useWeather';
import type { City } from '../../src/types/weather';
import { mockWeatherData } from '../../src/types/weather.mock';

const { getWeatherMock, searchCitiesMock } = vi.hoisted(() => ({
  getWeatherMock: vi.fn(),
  searchCitiesMock: vi.fn(),
}));

vi.mock('../../src/services/weatherService', () => ({
  getWeather: getWeatherMock,
  searchCities: searchCitiesMock,
}));

const firstCity: City = {
  name: 'Lisboa',
  region: 'Lisboa',
  country: 'Portugal',
  latitude: 38.71667,
  longitude: -9.13333,
};

const secondCity: City = {
  ...firstCity,
  name: 'Lisboa, Maine',
  country: 'Estados Unidos',
};

describe('useWeather', () => {
  beforeEach(() => {
    getWeatherMock.mockReset();
    searchCitiesMock.mockReset();
  });

  it('searches cities and loads the first result automatically', async () => {
    searchCitiesMock.mockResolvedValue([firstCity, secondCity]);
    getWeatherMock.mockResolvedValue({ ...mockWeatherData, city: firstCity });

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search(' Lisboa ');
    });

    expect(result.current.query).toBe('Lisboa');
    expect(result.current.cities).toEqual([firstCity, secondCity]);
    expect(result.current.data?.city).toEqual(firstCity);
    expect(result.current.status).toBe('success');
  });

  it('enters empty when search returns no cities', async () => {
    searchCitiesMock.mockResolvedValue([]);

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Atlantis');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.data).toBeUndefined();
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('selects a city and retries the last operation after an error', async () => {
    getWeatherMock
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce({ ...mockWeatherData, city: secondCity });

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(secondCity);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Não foi possível carregar a previsão.');

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data?.city).toEqual(secondCity);
  });
});
