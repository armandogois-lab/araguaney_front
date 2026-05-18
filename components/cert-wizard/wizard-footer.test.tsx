import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardFooter } from './wizard-footer';

describe('<WizardFooter />', () => {
  it('Step 1: shows Cancel + Continuar (disabled when canContinue=false)', () => {
    render(
      <WizardFooter
        step={1}
        canContinue={false}
        onCancel={vi.fn()}
        onBack={vi.fn()}
        onContinue={vi.fn()}
        onRecalculate={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /atr[aá]s/i })).not.toBeInTheDocument();
  });

  it('Step 2 with simulation: shows Recalcular, Atrás, Cancelar, Crear borrador', () => {
    render(
      <WizardFooter
        step={2}
        hasSimulation={true}
        canContinue={true}
        onCancel={vi.fn()}
        onBack={vi.fn()}
        onContinue={vi.fn()}
        onRecalculate={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /recalcular/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atr[aá]s/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear borrador/i })).toBeInTheDocument();
    expect(screen.getByText(/se reservar[aá]n las [oó]rdenes/i)).toBeInTheDocument();
  });

  it('Step 2 without simulation: Crear borrador is hidden, Recalcular is primary', () => {
    render(
      <WizardFooter
        step={2}
        hasSimulation={false}
        canContinue={false}
        onCancel={vi.fn()}
        onBack={vi.fn()}
        onContinue={vi.fn()}
        onRecalculate={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: /crear borrador/i })).toBeNull();
    expect(screen.queryByText(/se reservar[aá]n las [oó]rdenes/i)).toBeNull();
    expect(screen.getByRole('button', { name: /recalcular/i })).toBeInTheDocument();
  });

  it('Step 3: Confirmar emisión button calls onConfirm', () => {
    const onConfirm = vi.fn();
    render(
      <WizardFooter
        step={3}
        canContinue={true}
        onCancel={vi.fn()}
        onBack={vi.fn()}
        onContinue={vi.fn()}
        onRecalculate={vi.fn()}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /confirmar emisi[oó]n/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables all action buttons when busy=true', () => {
    render(
      <WizardFooter
        step={3}
        canContinue={true}
        busy={true}
        onCancel={vi.fn()}
        onBack={vi.fn()}
        onContinue={vi.fn()}
        onRecalculate={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /confirmar emisi[oó]n/i })).toBeDisabled();
  });
});
