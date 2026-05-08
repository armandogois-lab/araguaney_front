import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './page-header';

describe('<PageHeader />', () => {
  it('renders breadcrumb section + current with current bolded', () => {
    render(
      <PageHeader
        breadcrumb={{ section: 'Operación', current: 'Panel del ciclo' }}
        title="Panel del ciclo"
      />,
    );
    expect(screen.getByText(/Operación/)).toBeInTheDocument();
    const current = screen.getByText('Panel del ciclo', { selector: 'b' });
    expect(current).toBeInTheDocument();
  });

  it('renders the title as an h1', () => {
    render(<PageHeader breadcrumb={{ section: 'Datos', current: 'Lotes' }} title="Lotes" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Lotes' })).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <PageHeader
        breadcrumb={{ section: 'Operación', current: 'Panel del ciclo' }}
        title="Panel del ciclo"
        actions={<button>Subir lote</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Subir lote' })).toBeInTheDocument();
  });

  it('does not render actions wrapper when actions absent', () => {
    const { container } = render(
      <PageHeader breadcrumb={{ section: 'Datos', current: 'Lotes' }} title="Lotes" />,
    );
    expect(container.querySelector('button')).toBeNull();
  });
});
