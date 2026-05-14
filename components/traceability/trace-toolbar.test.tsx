import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TraceToolbar, type TraceFiltersValue } from './trace-toolbar';

const DEFAULT: TraceFiltersValue = {
  q: '',
  dateFrom: '2026-04-14',
  dateTo: '2026-05-14',
};

describe('<TraceToolbar />', () => {
  it('renders search input + 2 date inputs with default values', () => {
    render(<TraceToolbar value={DEFAULT} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/c[oó]digo, inversor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/desde/i)).toHaveValue('2026-04-14');
    expect(screen.getByLabelText(/hasta/i)).toHaveValue('2026-05-14');
  });

  it('debounces search by 300ms', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<TraceToolbar value={DEFAULT} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/c[oó]digo, inversor/i);
    fireEvent.change(input, { target: { value: 'Alpha' } });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(310);
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, q: 'Alpha' });
    vi.useRealTimers();
  });

  it('emits dateFrom change immediately', () => {
    const onChange = vi.fn();
    render(<TraceToolbar value={DEFAULT} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2026-05-01' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, dateFrom: '2026-05-01' });
  });

  it('emits dateTo change immediately', () => {
    const onChange = vi.fn();
    render(<TraceToolbar value={DEFAULT} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2026-05-31' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, dateTo: '2026-05-31' });
  });
});
