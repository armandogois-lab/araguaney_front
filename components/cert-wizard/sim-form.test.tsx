import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SimForm } from './sim-form';

const investor = { id: 'inv-1', legal_name: 'Alpha', rif: 'J-1' };
const params = {
  capital: '100000',
  rate: '0.13',
  term_days: 42 as const,
  issue_date: '2026-05-10',
};

describe('<SimForm />', () => {
  it('renders investor card + all 4 inputs with current values', () => {
    render(
      <SimForm
        investor={investor}
        params={params}
        onParamsChange={vi.fn()}
        onChangeInvestor={vi.fn()}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByLabelText(/capital/i)).toHaveValue(100000);
    expect(screen.getByLabelText(/tasa anual/i)).toHaveValue(13);
    expect(screen.getByLabelText(/fecha de emisi/i)).toHaveValue('2026-05-10');
    expect(screen.getByRole('button', { name: '42 días' })).toHaveAttribute('data-active', 'true');
  });

  it('emits onParamsChange when capital changes', () => {
    const onParamsChange = vi.fn();
    render(
      <SimForm
        investor={investor}
        params={params}
        onParamsChange={onParamsChange}
        onChangeInvestor={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText(/capital/i), { target: { value: '50000' } });
    expect(onParamsChange).toHaveBeenCalledWith({ capital: '50000' });
  });

  it('toggling term to 14 emits onParamsChange with term_days: 14', () => {
    const onParamsChange = vi.fn();
    render(
      <SimForm
        investor={investor}
        params={params}
        onParamsChange={onParamsChange}
        onChangeInvestor={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '14 días' }));
    expect(onParamsChange).toHaveBeenCalledWith({ term_days: 14 });
  });

  it('rate input shows percent (13.0) but emits decimal (0.13)', () => {
    const onParamsChange = vi.fn();
    render(
      <SimForm
        investor={investor}
        params={params}
        onParamsChange={onParamsChange}
        onChangeInvestor={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText(/tasa anual/i), { target: { value: '15' } });
    expect(onParamsChange).toHaveBeenCalledWith({ rate: '0.15' });
  });
});
