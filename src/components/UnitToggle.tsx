import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const unitOptions: Array<{ value: Unit; label: string; ariaLabel: string }> = [
  { value: 'celsius', label: '°C', ariaLabel: 'Celsius' },
  { value: 'fahrenheit', label: '°F', ariaLabel: 'Fahrenheit' },
];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
      role="group"
    >
      {unitOptions.map((option) => {
        const isActive = option.value === unit;

        return (
          <button
            aria-label={option.ariaLabel}
            aria-pressed={isActive}
            className={`min-w-12 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
              isActive
                ? 'bg-accent-500 text-night-900'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
