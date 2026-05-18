import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { ApproveDraftModal } from './approve-draft-modal';

const { mockApprove } = vi.hoisted(() => ({ mockApprove: vi.fn() }));
vi.mock('@/lib/api/certificates', () => ({
  approveDraft: (...a: unknown[]) => mockApprove(...a),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('<ApproveDraftModal />', () => {
  beforeEach(() => mockApprove.mockReset());

  it('shows summary and confirm/cancel buttons', () => {
    renderWithQuery(
      <ApproveDraftModal
        certId="c-1"
        orderCount={42}
        nominalActual="100000.00"
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText(/aprobar este borrador/i)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByText(/\$100,000\.00/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^cancelar$/i })).toBeInTheDocument();
  });

  it('confirm calls approveDraft with cert id', async () => {
    mockApprove.mockResolvedValueOnce({ id: 'c-1', status: 'issued', certificate_code: 'C0001A' });
    renderWithQuery(
      <ApproveDraftModal certId="c-1" orderCount={1} nominalActual="0.00" onClose={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockApprove).toHaveBeenCalledWith('c-1');
  });

  it('cancel button fires onClose without mutation', () => {
    const onClose = vi.fn();
    renderWithQuery(
      <ApproveDraftModal certId="c-1" orderCount={1} nominalActual="0.00" onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^cancelar$/i }));
    expect(onClose).toHaveBeenCalled();
    expect(mockApprove).not.toHaveBeenCalled();
  });
});
