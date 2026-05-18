import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MerchantDetailHeader } from './merchant-detail-header';

describe('<MerchantDetailHeader />', () => {
  it('renders name, RIF, first/last seen dates', () => {
    render(
      <MerchantDetailHeader
        currentName="CENTRAL MADEIRENSE"
        rif="J-12345678-9"
        firstSeenAt="2026-01-15T00:00:00Z"
        lastSeenAt="2026-05-10T12:00:00Z"
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'CENTRAL MADEIRENSE' }),
    ).toBeInTheDocument();
    expect(screen.getByText('J-12345678-9')).toBeInTheDocument();
    expect(screen.getByText(/15\/01\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/10\/05\/2026/)).toBeInTheDocument();
  });
});
