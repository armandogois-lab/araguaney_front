import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithQuery } from '@/test/helpers/tanstack';
import { UploadBatchDropzone } from './upload-batch-dropzone';

vi.mock('@/lib/api/batches', () => ({
  listBatches: vi.fn().mockResolvedValue({ data: [], total: 0, limit: 3, offset: 0 }),
}));

describe('<UploadBatchDropzone />', () => {
  it('renders the prompt text', () => {
    renderWithQuery(<UploadBatchDropzone onPickFile={vi.fn()} error={null} />);
    expect(screen.getByText(/arrastra el archivo o haz click/i)).toBeInTheDocument();
    expect(screen.getByText(/acepta \.xlsx/i)).toBeInTheDocument();
  });

  it('calls onPickFile when a file is dropped', () => {
    const onPickFile = vi.fn();
    renderWithQuery(<UploadBatchDropzone onPickFile={onPickFile} error={null} />);
    const dropzone = screen.getByTestId('dropzone');
    const file = new File(['x'], 'test.xlsx');
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onPickFile).toHaveBeenCalledWith(file);
  });

  it('renders an inline error when error prop is set', () => {
    renderWithQuery(<UploadBatchDropzone onPickFile={vi.fn()} error="Archivo inválido" />);
    expect(screen.getByText('Archivo inválido')).toBeInTheDocument();
  });

  it('does not render inline error when error is null', () => {
    renderWithQuery(<UploadBatchDropzone onPickFile={vi.fn()} error={null} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
