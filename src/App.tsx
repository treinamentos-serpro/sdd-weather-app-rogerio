import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { data, error, query, retry, search, status } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-2xl text-sun">
              ☀️
            </span>
            <span className="text-lg font-bold">WeatherView</span>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchBar disabled={status === 'loading'} onSearch={(city) => void search(city)} />
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
        </div>
      </header>

      <main aria-busy={status === 'loading'} className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {status === 'idle' && (
          <EmptyState
            hint="Ex.: São Paulo, Lisboa ou Tóquio."
            title="Busque uma cidade para começar"
          />
        )}
        {status === 'loading' && <LoadingState />}
        {status === 'empty' && (
          <EmptyState
            hint="Verifique a grafia e tente novamente."
            title={
              query ? `Nenhuma cidade encontrada para "${query}"` : 'Nenhuma cidade encontrada'
            }
          />
        )}
        {status === 'error' && (
          <ErrorState
            message={error ?? 'Não foi possível carregar a previsão.'}
            onRetry={() => void retry()}
          />
        )}
        {status === 'success' && data && (
          <>
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-white/60">
        Dados meteorológicos por{' '}
        <a
          className="text-accent-400 hover:underline"
          href="https://open-meteo.com/"
          rel="noreferrer"
          target="_blank"
        >
          Open-Meteo
        </a>
      </footer>
    </div>
  );
}
