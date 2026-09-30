import { render, screen } from '@testing-library/react';
import CurrentWeather from '../../src/components/CurrentWeather';
import { mockWeatherData } from '../../src/types/weather.mock';

describe('CurrentWeather', () => {
  it('renders the current weather and metrics in Celsius', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('heading', { name: /São Paulo/ })).toBeInTheDocument();
    expect(screen.getByText('23°C')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText('11 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(screen.getByText('1012 hPa')).toBeInTheDocument();
  });

  it('derives Fahrenheit during rendering', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('73°F')).toBeInTheDocument();
  });
});
