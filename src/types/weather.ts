export type Unit = 'celsius' | 'fahrenheit';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface City {
  name: string; // Nome da cidade.
  region?: string; // Estado ou região administrativa.
  country: string; // Nome do país.
  latitude: number; // Latitude em graus decimais.
  longitude: number; // Longitude em graus decimais.
}

export interface CurrentWeather {
  observedAt: string; // Horário da observação no fuso local, em ISO 8601.
  temperatureCelsius: number; // Temperatura atual em Celsius.
  apparentTemperatureCelsius: number; // Sensação térmica em Celsius.
  relativeHumidity: number; // Umidade relativa entre 0 e 100%.
  windSpeedKmh: number; // Velocidade do vento em km/h.
  precipitationMm: number; // Precipitação em milímetros.
  pressureHpa: number; // Pressão atmosférica em hPa.
  weatherCode: number; // Código meteorológico WMO.
}

export interface ForecastDay {
  date: string; // Data local no formato ISO 8601: YYYY-MM-DD.
  minimumCelsius: number; // Temperatura mínima em Celsius.
  maximumCelsius: number; // Temperatura máxima em Celsius.
  precipitationProbability: number; // Probabilidade máxima de precipitação em percentual.
  weatherCode: number; // Código meteorológico WMO do dia.
}

export interface WeatherData {
  city: City; // Cidade selecionada.
  timezone: string; // Fuso horário retornado pela Open-Meteo.
  current: CurrentWeather; // Condições meteorológicas atuais.
  forecast: ForecastDay[]; // Previsão diária, com cinco itens no MVP.
}
