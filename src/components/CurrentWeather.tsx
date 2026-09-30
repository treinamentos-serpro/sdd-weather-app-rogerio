import { convertTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatTemperature(temperatureCelsius: number, unit: Unit): string {
  const value = convertTemperature(temperatureCelsius, unit);
  return `${value}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const condition = getWeatherCondition(current.weatherCode);
  const location = city.region ? `${city.name}, ${city.region}` : city.name;

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-white/60">Agora</p>
          <h1 className="mt-1 text-2xl font-bold text-white" id="current-weather-title">
            {location}
          </h1>
          <p className="text-sm text-white/60">{city.country}</p>
        </div>

        <div className="flex items-center gap-4">
          <span aria-label={condition.accessibleLabel} className="text-5xl" role="img">
            {condition.icon}
          </span>
          <div>
            <p className="text-6xl font-bold leading-none text-white">
              {formatTemperature(current.temperatureCelsius, unit)}
            </p>
            <p className="mt-2 text-white/70">{condition.label}</p>
          </div>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <dt className="text-sm text-white/60">Umidade</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{current.relativeHumidity}%</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <dt className="text-sm text-white/60">Vento</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{current.windSpeedKmh} km/h</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <dt className="text-sm text-white/60">Precipitação</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{current.precipitationMm} mm</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <dt className="text-sm text-white/60">Pressão</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{current.pressureHpa} hPa</dd>
        </div>
      </dl>
    </section>
  );
}
