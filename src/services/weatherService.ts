import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const geocodingEndpoint = 'https://geocoding-api.open-meteo.com/v1/search';
const forecastEndpoint = 'https://api.open-meteo.com/v1/forecast';

interface GeocodingResult {
  name?: string;
  admin1?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastCurrentResponse {
  time?: string;
  temperature_2m?: number;
  apparent_temperature?: number;
  relative_humidity_2m?: number;
  wind_speed_10m?: number;
  precipitation?: number;
  surface_pressure?: number;
  weather_code?: number;
}

interface ForecastDailyResponse {
  time?: string[];
  temperature_2m_min?: number[];
  temperature_2m_max?: number[];
  precipitation_probability_max?: number[];
  weather_code?: number[];
}

interface ForecastResponse {
  timezone?: string;
  current?: ForecastCurrentResponse;
  daily?: ForecastDailyResponse;
}

export class WeatherServiceError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'WeatherServiceError';
    this.status = status;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new WeatherServiceError('Resposta inválida da API.', response.status);
  }
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError')
  );
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10_000);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (isAbortError(error)) {
      throw new WeatherServiceError('A requisição demorou demais.', 408);
    }

    throw new WeatherServiceError('Falha de rede.', 0);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function searchCities(name: string): Promise<City[]> {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return [];
  }

  const query = [
    `name=${encodeURIComponent(normalizedName)}`,
    'count=10',
    'language=pt',
    'format=json',
  ].join('&');
  const response = await fetchWithTimeout(`${geocodingEndpoint}?${query}`);

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar cidades.', response.status);
  }

  const payload = await parseJson<GeocodingResponse>(response);

  return (payload.results ?? [])
    .filter(
      (
        result,
      ): result is Required<Pick<GeocodingResult, 'name' | 'country' | 'latitude' | 'longitude'>> &
        GeocodingResult =>
        Boolean(
          result.name &&
            result.country &&
            typeof result.latitude === 'number' &&
            Number.isFinite(result.latitude) &&
            typeof result.longitude === 'number' &&
            Number.isFinite(result.longitude),
        ),
    )
    .map((result) => ({
      name: result.name,
      region: result.admin1,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    }));
}

function isNumber(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isCompleteForecastCurrent(
  current: ForecastCurrentResponse,
): current is Required<ForecastCurrentResponse> {
  return Boolean(
    current.time &&
      isNumber(current.temperature_2m) &&
      isNumber(current.apparent_temperature) &&
      isNumber(current.relative_humidity_2m) &&
      isNumber(current.wind_speed_10m) &&
      isNumber(current.precipitation) &&
      isNumber(current.surface_pressure) &&
      isNumber(current.weather_code),
  );
}

function isCompleteForecastDaily(
  daily: ForecastDailyResponse,
): daily is Required<ForecastDailyResponse> {
  return Boolean(
    daily.time?.length === 5 &&
      daily.temperature_2m_min?.length === 5 &&
      daily.temperature_2m_max?.length === 5 &&
      daily.precipitation_probability_max?.length === 5 &&
      daily.weather_code?.length === 5 &&
      daily.temperature_2m_min.every(isNumber) &&
      daily.temperature_2m_max.every(isNumber) &&
      daily.precipitation_probability_max.every(isNumber) &&
      daily.weather_code.every(isNumber),
  );
}

export async function getWeather(city: City): Promise<WeatherData> {
  const query = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: 'auto',
    forecast_days: '5',
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure,weather_code',
    daily: 'temperature_2m_min,temperature_2m_max,precipitation_probability_max,weather_code',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });
  const response = await fetchWithTimeout(`${forecastEndpoint}?${query.toString()}`);

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar a previsão.', response.status);
  }

  const payload = await parseJson<ForecastResponse>(response);
  const currentPayload = payload.current;
  const dailyPayload = payload.daily;
  if (
    !payload.timezone ||
    !currentPayload ||
    !dailyPayload ||
    !isCompleteForecastCurrent(currentPayload) ||
    !isCompleteForecastDaily(dailyPayload)
  ) {
    throw new WeatherServiceError('Resposta incompleta da previsão.', 422);
  }

  const current: CurrentWeather = {
    observedAt: currentPayload.time,
    temperatureCelsius: currentPayload.temperature_2m,
    apparentTemperatureCelsius: currentPayload.apparent_temperature,
    relativeHumidity: currentPayload.relative_humidity_2m,
    windSpeedKmh: currentPayload.wind_speed_10m,
    precipitationMm: currentPayload.precipitation,
    pressureHpa: currentPayload.surface_pressure,
    weatherCode: currentPayload.weather_code,
  };
  const forecast: ForecastDay[] = dailyPayload.time.map((date, index) => ({
    date,
    minimumCelsius: dailyPayload.temperature_2m_min[index],
    maximumCelsius: dailyPayload.temperature_2m_max[index],
    precipitationProbability: dailyPayload.precipitation_probability_max[index],
    weatherCode: dailyPayload.weather_code[index],
  }));

  return { city, timezone: payload.timezone, current, forecast };
}
