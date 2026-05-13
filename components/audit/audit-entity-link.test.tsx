import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuditEntityLink } from './audit-entity-link';

describe('<AuditEntityLink />', () => {
  it('renders a link to /certificates/{id} when entity_type is certificate', () => {
    render(<AuditEntityLink entityType="certificate" entityId="cert-uuid-1" />);
    const link = screen.getByRole('link', { name: 'cert-uuid-1' });
    expect(link).toHaveAttribute('href', '/certificates/cert-uuid-1');
  });

  it('renders plain mono text for batch entity type', () => {
    render(<AuditEntityLink entityType="batch" entityId="batch-uuid" />);
    expect(screen.getByText('batch-uuid')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders plain mono text for investor entity type', () => {
    render(<AuditEntityLink entityType="investor" entityId="inv-uuid" />);
    expect(screen.getByText('inv-uuid')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders "—" when entityId is null', () => {
    render(<AuditEntityLink entityType="system" entityId={null} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
