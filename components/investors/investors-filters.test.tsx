import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InvestorsFilters, type InvestorsFiltersValue } from './investors-filters';

const DEFAULT: InvestorsFiltersValue = {
  status: 'active',
  q: '',
};

describe('<InvestorsFilters />', () => {
  it('renders 3 status pills with Activos active by default', () => {
    render(<InvestorsFilters value={DEFAULT} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Activos' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('data-active', 'false');
    expect(screen.getByRole('button', { name: 'Inactivos' })).toHaveAttribute(
      'data-active',
      'false',
    );
  });

  it('clicking "Todos" emits status: "all"', () => {
    const onChange = vi.fn();
    render(<InvestorsFilters value={DEFAULT} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Todos' }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, status: 'all' });
  });

  it('clicking "Inactivos" emits status: "inactive"', () => {
    const onChange = vi.fn();
    render(<InvestorsFilters value={DEFAULT} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inactivos' }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, status: 'inactive' });
  });

  it('debounces the search input by 300ms', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<InvestorsFilters value={DEFAULT} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/raz[oó]n social o rif/i);
    fireEvent.change(input, { target: { value: 'Alpha' } });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(310);
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, q: 'Alpha' });
    vi.useRealTimers();
  });

  it('does not emit when typed value equals current value', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<InvestorsFilters value={{ ...DEFAULT, q: 'Alpha' }} onChange={onChange} />);
    vi.advanceTimersByTime(500);
    expect(onChange).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
