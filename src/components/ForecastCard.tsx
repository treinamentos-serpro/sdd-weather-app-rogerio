import { formatForecastDay } from '../lib/format';
import { convertTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

function formatTemperature(temperatureCelsius: number, unit: Unit): string {
  const value = convertTemperature(temperatureCelsius, unit);
  return `${value}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const condition = getWeatherCondition(day.weatherCode);

  return (
    <article
      aria-label={`Previsão para ${formatForecastDay(day.date)}`}
      className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <p className="text-sm font-semibold capitalize text-white/80">
        {formatForecastDay(day.date)}
      </p>
      <span aria-label={condition.accessibleLabel} className="mt-4 text-4xl" role="img">
        {condition.icon}
      </span>
      <p className="mt-2 min-h-10 text-sm text-white/70">{condition.label}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-white/60">Máx.</dt>
          <dd className="font-semibold text-white">
            {formatTemperature(day.maximumCelsius, unit)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-white/60">Mín.</dt>
          <dd className="font-semibold text-white">
            {formatTemperature(day.minimumCelsius, unit)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-white/60">Chuva</dt>
          <dd className="font-semibold text-white">{day.precipitationProbability}%</dd>
        </div>
      </dl>
    </article>
  );
}
