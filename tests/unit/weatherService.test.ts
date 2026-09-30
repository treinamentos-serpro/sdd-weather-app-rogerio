import {
  fetchWithTimeout,
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

describe('searchCities', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('returns an empty list without calling the network for empty input', async () => {
    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps Open-Meteo results to City', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              name: 'Lisboa',
              admin1: 'Lisboa',
              country: 'Portugal',
              latitude: 38.71667,
              longitude: -9.13333,
            },
          ],
        }),
        { status: 200 },
      ),
    );

    await expect(searchCities('Lisboa central')).resolves.toEqual([
      {
        name: 'Lisboa',
        region: 'Lisboa',
        country: 'Portugal',
        latitude: 38.71667,
        longitude: -9.13333,
      },
    ]);

    expect(fetchMock.mock.calls[0][0]).toContain('name=Lisboa%20central');
  });

  it('throws WeatherServiceError for a non-ok response', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    await expect(searchCities('Lisboa')).rejects.toMatchObject({
      constructor: WeatherServiceError,
      status: 503,
    });
  });

  it('converts invalid JSON into WeatherServiceError', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new SyntaxError('invalid JSON')),
    });

    await expect(searchCities('Lisboa')).rejects.toMatchObject({
      message: 'Resposta inválida da API.',
      status: 200,
    });
  });
});

describe('fetchWithTimeout', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('converts network failures to WeatherServiceError', async () => {
    fetchMock.mockRejectedValue(new TypeError('network failure'));

    await expect(fetchWithTimeout('/weather')).rejects.toMatchObject({
      message: 'Falha de rede.',
      status: 0,
    });
  });

  it('aborts after 10 seconds, maps AbortError, and clears the timer', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        }),
    );

    const request = fetchWithTimeout('/weather');
    const assertion = expect(request).rejects.toMatchObject({
      message: 'A requisição demorou demais.',
      status: 408,
    });
    await vi.advanceTimersByTimeAsync(10_000);

    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('getWeather', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  const city: City = {
    name: 'Lisboa',
    region: 'Lisboa',
    country: 'Portugal',
    latitude: 38.71667,
    longitude: -9.13333,
  };

  const daily = {
    time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
    temperature_2m_min: [16, 15, 17, 18, 16],
    temperature_2m_max: [23, 22, 24, 25, 21],
    precipitation_probability_max: [10, 20, 0, 60, 80],
    weather_code: [1, 3, 0, 61, 80],
  };

  it('maps current weather and parallel daily arrays to WeatherData', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          timezone: 'Europe/Lisbon',
          current: {
            time: '2026-09-30T12:00',
            temperature_2m: 21.4,
            apparent_temperature: 21.1,
            relative_humidity_2m: 58,
            wind_speed_10m: 12.3,
            precipitation: 0,
            surface_pressure: 1014,
            weather_code: 1,
          },
          daily,
        }),
        { status: 200 },
      ),
    );

    await expect(getWeather(city)).resolves.toEqual({
      city,
      timezone: 'Europe/Lisbon',
      current: {
        observedAt: '2026-09-30T12:00',
        temperatureCelsius: 21.4,
        apparentTemperatureCelsius: 21.1,
        relativeHumidity: 58,
        windSpeedKmh: 12.3,
        precipitationMm: 0,
        pressureHpa: 1014,
        weatherCode: 1,
      },
      forecast: [
        {
          date: '2026-09-30',
          minimumCelsius: 16,
          maximumCelsius: 23,
          precipitationProbability: 10,
          weatherCode: 1,
        },
        {
          date: '2026-10-01',
          minimumCelsius: 15,
          maximumCelsius: 22,
          precipitationProbability: 20,
          weatherCode: 3,
        },
        {
          date: '2026-10-02',
          minimumCelsius: 17,
          maximumCelsius: 24,
          precipitationProbability: 0,
          weatherCode: 0,
        },
        {
          date: '2026-10-03',
          minimumCelsius: 18,
          maximumCelsius: 25,
          precipitationProbability: 60,
          weatherCode: 61,
        },
        {
          date: '2026-10-04',
          minimumCelsius: 16,
          maximumCelsius: 21,
          precipitationProbability: 80,
          weatherCode: 80,
        },
      ],
    });

    expect(fetchMock.mock.calls[0][0]).toContain('forecast_days=5');
  });

  it.each([
    { timezone: 'Europe/Lisbon', daily },
    {
      timezone: 'Europe/Lisbon',
      current: { time: '2026-09-30T12:00', temperature_2m: 21 },
      daily,
    },
    {
      timezone: 'Europe/Lisbon',
      current: {
        time: '2026-09-30T12:00',
        temperature_2m: 21,
        apparent_temperature: 21,
        relative_humidity_2m: 58,
        wind_speed_10m: 12,
        precipitation: 0,
        surface_pressure: 1014,
        weather_code: 1,
      },
    },
  ])('throws WeatherServiceError for incomplete response', async (payload) => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
