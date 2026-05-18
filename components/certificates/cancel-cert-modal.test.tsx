import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { CancelCertModal } from './cancel-cert-modal';

const { mockCancel, toastSuccess, toastError } = vi.hoisted(() => ({
  mockCancel: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@/lib/api/certificates', () => ({
  cancelCertificate: (...a: unknown[]) => mockCancel(...a),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...a: unknown[]) => toastSuccess(...a),
    error: (...a: unknown[]) => toastError(...a),
  },
}));

describe('<CancelCertModal />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders title with code + irreversibility warning', () => {
    renderWithQuery(
      <CancelCertModal certId="c-1" certCode="C4572A" orderCount={343} onClose={vi.fn()} />,
    );
    expect(screen.getByText(/cancelar certificado c4572a/i)).toBeInTheDocument();
    expect(screen.getByText(/no puede deshacerse/i)).toBeInTheDocument();
    expect(screen.getByText(/343 [oó]rdenes/i)).toBeInTheDocument();
  });

  it('disables Confirmar when reason < 5 chars', () => {
    renderWithQuery(
      <CancelCertModal certId="c-1" certCode="C4572A" orderCount={1} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abcde' } });
    expect(screen.getByRole('button', { name: /confirmar/i })).not.toBeDisabled();
  });

  it('shows character counter', () => {
    renderWithQuery(
      <CancelCertModal certId="c-1" certCode="C4572A" orderCount={1} onClose={vi.fn()} />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hola' } });
    expect(screen.getByText(/4.*\/.*1000/)).toBeInTheDocument();
  });

  it('on Confirmar: calls cancelCertificate + toast + close', async () => {
    mockCancel.mockResolvedValueOnce({ certificate_code: 'C4572A', status: 'cancelled' });
    const onClose = vi.fn();
    renderWithQuery(
      <CancelCertModal certId="c-1" certCode="C4572A" orderCount={1} onClose={onClose} />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Cliente solicitó baja' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    await waitFor(() =>
      expect(mockCancel).toHaveBeenCalledWith('c-1', { reason: 'Cliente solicitó baja' }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(toastSuccess).toHaveBeenCalledWith(expect.stringContaining('C4572A'));
  });

  it('on error: toast error + modal stays open', async () => {
    mockCancel.mockRejectedValueOnce(new Error('Solo se puede cancelar issued'));
    const onClose = vi.fn();
    renderWithQuery(
      <CancelCertModal certId="c-1" certCode="C4572A" orderCount={1} onClose={onClose} />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'razón válida' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  it('clicking backdrop calls onClose', () => {
    const onClose = vi.fn();
    const { container } = renderWithQuery(
      <CancelCertModal certId="c-1" certCode="C4572A" orderCount={1} onClose={onClose} />,
    );
    fireEvent.click(container.querySelector('[data-testid="cancel-modal-backdrop"]')!);
    expect(onClose).toHaveBeenCalled();
  });
});
