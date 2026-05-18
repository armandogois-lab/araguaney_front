import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MerchantsPagination } from './merchants-pagination';

describe('<MerchantsPagination />', () => {
  it('shows "1-25 de 142" when offset=0 limit=25 total=142', () => {
    render(<MerchantsPagination offset={0} limit={25} total={142} onPageChange={vi.fn()} />);
    expect(screen.getByText(/1.*25.*142/)).toBeInTheDocument();
  });

  it('shows "126-142 de 142" when offset=125 limit=25 total=142', () => {
    render(<MerchantsPagination offset={125} limit={25} total={142} onPageChange={vi.fn()} />);
    expect(screen.getByText(/126.*142.*142/)).toBeInTheDocument();
  });

  it('prev disabled when offset=0', () => {
    render(<MerchantsPagination offset={0} limit={25} total={142} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled();
  });

  it('next disabled when offset+limit >= total', () => {
    render(<MerchantsPagination offset={125} limit={25} total={142} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled();
  });

  it('next emits page+1 offset', () => {
    const onPageChange = vi.fn();
    render(<MerchantsPagination offset={0} limit={25} total={142} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('prev emits page-1', () => {
    const onPageChange = vi.fn();
    render(<MerchantsPagination offset={50} limit={25} total={142} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
