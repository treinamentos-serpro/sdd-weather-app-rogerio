import { render, screen } from '@testing-library/react';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/types/weather.mock';

describe('ForecastList', () => {
  it('renders five forecast cards with daily metrics', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getAllByText('17°C')).not.toHaveLength(0);
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('derives Fahrenheit values for every card', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="fahrenheit" />);

    expect(screen.getByText('77°F')).toBeInTheDocument();
    expect(screen.getAllByText('63°F')).not.toHaveLength(0);
  });
});
