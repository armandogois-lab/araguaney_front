import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsersToolbar, type UsersFiltersValue } from './users-toolbar';

const EMPTY: UsersFiltersValue = { q: '', role: 'all', is_active: 'all' };

describe('<UsersToolbar />', () => {
  it('renders search + 2 selects', () => {
    render(<UsersToolbar value={EMPTY} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/email o nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
  });

  it('debounces search 300ms', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<UsersToolbar value={EMPTY} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(/email o nombre/i), {
      target: { value: 'ana' },
    });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(310);
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY, q: 'ana' });
    vi.useRealTimers();
  });

  it('emits role change immediately', () => {
    const onChange = vi.fn();
    render(<UsersToolbar value={EMPTY} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/rol/i), { target: { value: 'admin' } });
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY, role: 'admin' });
  });

  it('emits is_active change immediately', () => {
    const onChange = vi.fn();
    render(<UsersToolbar value={EMPTY} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'active' } });
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY, is_active: 'active' });
  });
});
