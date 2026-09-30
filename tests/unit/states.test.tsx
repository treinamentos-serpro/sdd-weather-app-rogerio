import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('weather state components', () => {
  it('announces loading status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando previsão...');
  });

  it('shows an error and retries by keyboard', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState message="Não foi possível carregar a previsão." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar a previsão.');
    await user.tab();
    await user.keyboard('{Enter}');

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders an empty state with title and hint', () => {
    render(<EmptyState hint="Tente outra grafia." title="Nenhuma cidade encontrada" />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Tente outra grafia.')).toBeInTheDocument();
  });
});
