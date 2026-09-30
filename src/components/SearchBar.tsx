import type { FormEvent } from 'react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCity = city.trim();
    if (!normalizedCity) {
      setValidationMessage('Informe uma cidade para buscar.');
      return;
    }

    if (disabled) {
      return;
    }

    setValidationMessage('');
    onSearch(normalizedCity);
  }

  return (
    <form
      aria-label="Buscar cidade"
      className="flex w-full max-w-md items-end gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-md"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="min-w-0 flex-1">
        <label className="mb-1 block text-sm font-medium text-white/80" htmlFor="city-search">
          Cidade
        </label>
        <input
          autoComplete="off"
          aria-describedby={validationMessage ? 'city-search-error' : undefined}
          aria-invalid={validationMessage ? 'true' : undefined}
          className="w-full rounded-lg border border-white/10 bg-night-800 px-3 py-2 text-white outline-none transition placeholder:text-white/60 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id="city-search"
          name="city"
          onChange={(event) => {
            setCity(event.target.value);
            if (validationMessage) {
              setValidationMessage('');
            }
          }}
          placeholder="Digite uma cidade"
          type="search"
          value={city}
        />
        {validationMessage && (
          <p className="mt-1 text-sm text-red-200" id="city-search-error" role="alert">
            {validationMessage}
          </p>
        )}
      </div>
      <button
        className="rounded-lg bg-accent-500 px-4 py-2 font-semibold text-night-900 transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}
