import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditFilters, type AuditFiltersValue } from './audit-filters';

const DEFAULT: AuditFiltersValue = {
  entityType: 'all',
  action: 'all',
  dateFrom: '2026-04-13',
  dateTo: '2026-05-13',
};

describe('<AuditFilters />', () => {
  it('renders entity_type pills with "Todos" active by default', () => {
    render(<AuditFilters value={DEFAULT} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('button', { name: 'Certificate' })).toHaveAttribute(
      'data-active',
      'false',
    );
  });

  it('clicking "Certificate" emits entityType: "certificate"', () => {
    const onChange = vi.fn();
    render(<AuditFilters value={DEFAULT} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Certificate' }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, entityType: 'certificate' });
  });

  it('clicking action pill "Actualizar" emits action: "update"', () => {
    const onChange = vi.fn();
    render(<AuditFilters value={DEFAULT} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, action: 'update' });
  });

  it('changing date inputs emits dateFrom / dateTo', () => {
    const onChange = vi.fn();
    render(<AuditFilters value={DEFAULT} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2026-05-01' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, dateFrom: '2026-05-01' });
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2026-05-31' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, dateTo: '2026-05-31' });
  });

  it('selecting from "Otros" dropdown emits entityType', () => {
    const onChange = vi.fn();
    render(<AuditFilters value={DEFAULT} onChange={onChange} />);
    const select = screen.getByLabelText(/otros tipos/i);
    fireEvent.change(select, { target: { value: 'installment' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT, entityType: 'installment' });
  });
});
