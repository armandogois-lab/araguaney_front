import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CycleCtaButtons } from './cycle-cta-buttons';

describe('<CycleCtaButtons />', () => {
  it('operator sees both buttons', () => {
    render(<CycleCtaButtons userRole="operator" />);
    const upload = screen.getByRole('link', { name: /subir lote/i });
    expect(upload).toHaveAttribute('href', '/batches');
    const newCert = screen.getByRole('link', { name: /nuevo certificado/i });
    expect(newCert).toHaveAttribute('href', '/stock');
  });

  it('admin sees both buttons', () => {
    render(<CycleCtaButtons userRole="admin" />);
    expect(screen.getByRole('link', { name: /subir lote/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /nuevo certificado/i })).toBeInTheDocument();
  });

  it('auditor sees neither button', () => {
    const { container } = render(<CycleCtaButtons userRole="auditor" />);
    expect(screen.queryByRole('link', { name: /subir lote/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /nuevo certificado/i })).toBeNull();
    expect(container.firstChild).toBeNull();
  });
});
