import { useEffect, useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData, WeatherStatus } from '../types/weather';

export interface UseWeatherResult {
  status: WeatherStatus;
  data?: WeatherData;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

type WeatherOperation = () => Promise<void>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'WeatherServiceError') {
    return error.message;
  }

  return 'Não foi possível carregar a previsão.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData>();
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const lastOperation = useRef<WeatherOperation | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  async function executeCitySelection(city: City): Promise<void> {
    setStatus('loading');
    setError(null);

    try {
      const weather = await getWeather(city);
      if (!mounted.current) {
        return;
      }

      setData(weather);
      setStatus('success');
    } catch (caughtError) {
      if (!mounted.current) {
        return;
      }

      setError(getErrorMessage(caughtError));
      setStatus('error');
    }
  }

  async function executeSearch(name: string): Promise<void> {
    const normalizedName = name.trim();
    setQuery(normalizedName);
    setData(undefined);
    setCities([]);
    setError(null);
    setStatus('loading');

    try {
      const results = await searchCities(normalizedName);
      if (!mounted.current) {
        return;
      }

      setCities(results);
      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      await executeCitySelection(results[0]);
    } catch (caughtError) {
      if (!mounted.current) {
        return;
      }

      setError(getErrorMessage(caughtError));
      setStatus('error');
    }
  }

  async function search(name: string): Promise<void> {
    const operation = () => executeSearch(name);
    lastOperation.current = operation;
    await operation();
  }

  async function selectCity(city: City): Promise<void> {
    const operation = () => executeCitySelection(city);
    lastOperation.current = operation;
    await operation();
  }

  async function retry(): Promise<void> {
    if (lastOperation.current) {
      await lastOperation.current();
    }
  }

  return { cities, data, error, query, retry, search, selectCity, status };
}
