import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UploadBatchUploading } from './upload-batch-uploading';

describe('<UploadBatchUploading />', () => {
  it('renders the filename inside the loading text', () => {
    render(<UploadBatchUploading filename="lote_w17.xlsx" />);
    expect(screen.getByText(/lote_w17\.xlsx/)).toBeInTheDocument();
  });

  it('renders the secondary message', () => {
    render(<UploadBatchUploading filename="x.xlsx" />);
    expect(screen.getByText(/validando estructura/i)).toBeInTheDocument();
  });

  it('falls back to "el archivo" when filename is empty', () => {
    render(<UploadBatchUploading filename="" />);
    expect(screen.getByText(/subiendo el archivo/i)).toBeInTheDocument();
  });
});
