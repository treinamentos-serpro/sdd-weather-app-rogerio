import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('marks Celsius as active and changes to Fahrenheit by keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<UnitToggle onChange={onChange} unit="celsius" />);

    const group = screen.getByRole('group', { name: 'Unidade de temperatura' });
    const celsiusButton = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheitButton = screen.getByRole('button', { name: 'Fahrenheit' });

    expect(group).toBeInTheDocument();
    expect(celsiusButton).toHaveAttribute('aria-pressed', 'true');
    expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'false');

    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });

  it('marks Fahrenheit as active', () => {
    const onChange = vi.fn();

    render(<UnitToggle onChange={onChange} unit="fahrenheit" />);

    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
