import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CycleBanner } from './cycle-banner';

describe('<CycleBanner />', () => {
  it('renders week label + dayIndex + pct', () => {
    render(
      <CycleBanner
        weekNumber={17}
        weekLabel="del 20 al 24 de abril"
        dayIndex={3}
        pctAssigned={0.32}
      />,
    );
    expect(screen.getByText(/Semana 17/)).toBeInTheDocument();
    expect(screen.getByText(/del 20 al 24 de abril/)).toBeInTheDocument();
    expect(screen.getByText(/Día 3 de 5/)).toBeInTheDocument();
    expect(screen.getByText(/32%/)).toBeInTheDocument();
  });

  it('shows "Sin asignación todavía" when pctAssigned is 0', () => {
    render(
      <CycleBanner
        weekNumber={17}
        weekLabel="del 20 al 24 de abril"
        dayIndex={1}
        pctAssigned={0}
      />,
    );
    expect(screen.getByText(/Sin asignación todavía/)).toBeInTheDocument();
  });

  it('shows "Día 5 de 5" + pct when dayIndex is 5 and pctAssigned > 0', () => {
    render(
      <CycleBanner
        weekNumber={17}
        weekLabel="del 20 al 24 de abril"
        dayIndex={5}
        pctAssigned={0.85}
      />,
    );
    expect(screen.getByText(/Día 5 de 5/)).toBeInTheDocument();
    expect(screen.getByText(/85%/)).toBeInTheDocument();
  });
});
