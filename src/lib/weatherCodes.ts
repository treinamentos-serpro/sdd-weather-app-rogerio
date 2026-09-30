export interface WeatherCondition {
  label: string;
  icon: string;
  accessibleLabel: string;
}

const defaultCondition: WeatherCondition = {
  label: 'Condição não disponível',
  icon: '？',
  accessibleLabel: 'Condição meteorológica não disponível',
};

const conditions: Record<number, WeatherCondition> = {
  0: { label: 'Céu limpo', icon: '☀️', accessibleLabel: 'Céu limpo' },
  1: { label: 'Predominantemente limpo', icon: '🌤️', accessibleLabel: 'Predominantemente limpo' },
  2: { label: 'Parcialmente nublado', icon: '⛅', accessibleLabel: 'Parcialmente nublado' },
  3: { label: 'Nublado', icon: '☁️', accessibleLabel: 'Nublado' },
  45: { label: 'Neblina', icon: '🌫️', accessibleLabel: 'Neblina' },
  48: { label: 'Neblina congelante', icon: '🌫️', accessibleLabel: 'Neblina congelante' },
  51: { label: 'Garoa leve', icon: '🌦️', accessibleLabel: 'Garoa leve' },
  53: { label: 'Garoa moderada', icon: '🌦️', accessibleLabel: 'Garoa moderada' },
  55: { label: 'Garoa intensa', icon: '🌧️', accessibleLabel: 'Garoa intensa' },
  61: { label: 'Chuva leve', icon: '🌦️', accessibleLabel: 'Chuva leve' },
  63: { label: 'Chuva moderada', icon: '🌧️', accessibleLabel: 'Chuva moderada' },
  65: { label: 'Chuva forte', icon: '🌧️', accessibleLabel: 'Chuva forte' },
  71: { label: 'Neve leve', icon: '🌨️', accessibleLabel: 'Neve leve' },
  73: { label: 'Neve moderada', icon: '❄️', accessibleLabel: 'Neve moderada' },
  75: { label: 'Neve forte', icon: '❄️', accessibleLabel: 'Neve forte' },
  80: { label: 'Pancadas de chuva leves', icon: '🌦️', accessibleLabel: 'Pancadas de chuva leves' },
  81: {
    label: 'Pancadas de chuva moderadas',
    icon: '🌧️',
    accessibleLabel: 'Pancadas de chuva moderadas',
  },
  82: { label: 'Pancadas de chuva fortes', icon: '⛈️', accessibleLabel: 'Pancadas de chuva fortes' },
  95: { label: 'Trovoada', icon: '⛈️', accessibleLabel: 'Trovoada' },
  96: {
    label: 'Trovoada com granizo leve',
    icon: '⛈️',
    accessibleLabel: 'Trovoada com granizo leve',
  },
  99: {
    label: 'Trovoada com granizo forte',
    icon: '⛈️',
    accessibleLabel: 'Trovoada com granizo forte',
  },
};

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  return conditions[weatherCode] ?? defaultCondition;
}
