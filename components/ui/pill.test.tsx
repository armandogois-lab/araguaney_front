import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pill } from './pill';

describe('<Pill />', () => {
  it('renders children', () => {
    render(<Pill variant="success">Activo</Pill>);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('applies success variant classes', () => {
    const { container } = render(<Pill variant="success">x</Pill>);
    const span = container.querySelector('span.bg-green-bg');
    expect(span).not.toBeNull();
  });

  it('applies warn variant classes', () => {
    const { container } = render(<Pill variant="warn">x</Pill>);
    expect(container.querySelector('span.bg-warn-bg')).not.toBeNull();
  });

  it('applies info variant classes', () => {
    const { container } = render(<Pill variant="info">x</Pill>);
    expect(container.querySelector('span.bg-info-bg')).not.toBeNull();
  });

  it('applies neutral variant classes', () => {
    const { container } = render(<Pill variant="neutral">x</Pill>);
    expect(container.querySelector('span.bg-neutral-bg')).not.toBeNull();
  });

  it('applies sweep variant classes', () => {
    const { container } = render(<Pill variant="sweep">x</Pill>);
    expect(container.querySelector('span.bg-sweep-bg')).not.toBeNull();
  });

  it('defaults to neutral when no variant is provided', () => {
    const { container } = render(<Pill>x</Pill>);
    expect(container.querySelector('span.bg-neutral-bg')).not.toBeNull();
  });
});
