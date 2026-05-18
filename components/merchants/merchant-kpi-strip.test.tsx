import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MerchantKpiStrip } from './merchant-kpi-strip';

describe('<MerchantKpiStrip />', () => {
  it('renders 2 cards with localized count and money', () => {
    render(<MerchantKpiStrip orderCount={1234} totalAmount="56789.1234" />);
    expect(screen.getByText('Órdenes totales')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Monto total')).toBeInTheDocument();
    expect(screen.getByText('$56,789.12')).toBeInTheDocument();
  });
});
