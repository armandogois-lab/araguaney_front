import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MerchantsToolbar, type MerchantsFiltersValue } from './merchants-toolbar';

const EMPTY: MerchantsFiltersValue = { q: '', sort: 'name_asc' };

describe('<MerchantsToolbar />', () => {
  it('renders search + sort select', () => {
    render(<MerchantsToolbar value={EMPTY} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/comercio o rif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/orden/i)).toBeInTheDocument();
  });

  it('debounces search 300ms', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<MerchantsToolbar value={EMPTY} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(/comercio o rif/i), {
      target: { value: 'mercantil' },
    });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(310);
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY, q: 'mercantil' });
    vi.useRealTimers();
  });

  it('emits sort change immediately', () => {
    const onChange = vi.fn();
    render(<MerchantsToolbar value={EMPTY} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/orden/i), { target: { value: 'last_seen_desc' } });
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY, sort: 'last_seen_desc' });
  });
});
