import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { generateCertificateExcel } from './certificate-excel';
import type { CertificateDetail } from '@/lib/types/certificate';

function mockCert(over: Partial<CertificateDetail> = {}): CertificateDetail {
  return {
    id: 'c-1',
    certificate_code: 'C4572A',
    certificate_type: 'standard',
    status: 'issued',
    investor: { id: 'inv-1', legal_name: 'Inversora Alpha, C.A.', rif: 'J-12345678-9' },
    investor_capital: '100000.0000',
    annual_rate: '0.130000',
    term_days: 42,
    price: '0.984833',
    nominal_target: '101540.6000',
    nominal_actual: '101540.0000',
    investor_paid: '99999.4100',
    investor_returned: '0.5900',
    investor_yield: '1540.5900',
    shortfall_pct: '0.000006',
    issue_date: '2026-04-27',
    maturity_date: '2026-06-08',
    cycle_week: '2026-W18',
    issued_by: { id: 'u-1', email: 'op@x.com', full_name: 'María Rodríguez' },
    created_at: '2026-04-27T14:30:00Z',
    payload_hash: 'h-abc',
    cancellation: null,
    orders: [
      {
        id: 'o-1',
        external_order_id: '85657474',
        merchant: { id: 'm-1', current_name: 'CENTRAL MADEIRENSE', rif: 'J-1' },
        purchase_date: '2026-03-18',
        max_due_date: '2026-04-03',
        installments_sum_snapshot: '87.2400',
        assigned_at: '2026-04-27T14:30:00Z',
        installments: [
          { installment_number: 1, amount: '29.08', due_date: '2026-04-03', status: 'pending' },
          { installment_number: 2, amount: '29.08', due_date: '2026-04-10', status: 'pending' },
          { installment_number: 3, amount: '29.08', due_date: '2026-04-17', status: 'pending' },
        ],
      },
      {
        id: 'o-2',
        external_order_id: '85656105',
        merchant: { id: 'm-2', current_name: 'GRUPO CANALETTO', rif: 'J-2' },
        purchase_date: '2026-03-18',
        max_due_date: '2026-04-10',
        installments_sum_snapshot: '26.0700',
        assigned_at: '2026-04-27T14:30:00Z',
        installments: [
          { installment_number: 1, amount: '26.07', due_date: '2026-04-03', status: 'pending' },
        ],
      },
    ],
    events: [],
    ...over,
  };
}

async function reload(blob: Blob): Promise<ExcelJS.Workbook> {
  const buffer = await blob.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  return wb;
}

describe('generateCertificateExcel', () => {
  it('returns a Blob with the xlsx mime type', async () => {
    const blob = await generateCertificateExcel(mockCert());
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  it('has two sheets named "Resumen" and "Órdenes"', async () => {
    const blob = await generateCertificateExcel(mockCert());
    const wb = await reload(blob);
    expect(wb.worksheets.map((s) => s.name)).toEqual(['Resumen', 'Órdenes']);
  });

  it('Resumen sheet contains the certificate code and investor info', async () => {
    const blob = await generateCertificateExcel(mockCert());
    const wb = await reload(blob);
    const resumen = wb.getWorksheet('Resumen');
    expect(resumen).toBeDefined();
    // Collect all column-A labels
    const allValuesA: string[] = [];
    resumen!.eachRow((row) => allValuesA.push(String(row.getCell(1).value ?? '')));
    expect(allValuesA).toContain('Código');
    expect(allValuesA).toContain('Inversor');
    expect(allValuesA).toContain('RIF');
    expect(allValuesA).toContain('Primer vto pool');

    // Find the row whose A-cell is "Código" and check its B-cell
    let codeValue: unknown = null;
    resumen!.eachRow((row) => {
      if (String(row.getCell(1).value) === 'Código') {
        codeValue = row.getCell(2).value;
      }
    });
    expect(String(codeValue)).toBe('C4572A');
  });

  it('Órdenes sheet has a header row + one row per order + a TOTAL row', async () => {
    const blob = await generateCertificateExcel(mockCert());
    const wb = await reload(blob);
    const ordenes = wb.getWorksheet('Órdenes');
    expect(ordenes).toBeDefined();

    // Row 1: headers
    expect(String(ordenes!.getCell('A1').value)).toBe('ID orden');
    expect(String(ordenes!.getCell('B1').value)).toBe('Comercio');

    // Row 2 + 3: order data
    expect(String(ordenes!.getCell('A2').value)).toBe('85657474');
    expect(String(ordenes!.getCell('B2').value)).toBe('CENTRAL MADEIRENSE');
    expect(Number(ordenes!.getCell('F2').value)).toBe(3); // # cuotas
    expect(Number(ordenes!.getCell('G2').value)).toBeCloseTo(87.24, 2);

    expect(String(ordenes!.getCell('A3').value)).toBe('85656105');

    // Row 4: TOTAL
    expect(String(ordenes!.getCell('A4').value)).toBe('TOTAL');
    expect(Number(ordenes!.getCell('F4').value)).toBe(4); // 3 + 1 cuotas
    expect(Number(ordenes!.getCell('G4').value)).toBeCloseTo(113.31, 2);
  });

  it('uses min(orders.max_due_date) for "Primer vto pool"', async () => {
    const blob = await generateCertificateExcel(mockCert());
    const wb = await reload(blob);
    const resumen = wb.getWorksheet('Resumen')!;
    let foundValue: unknown = null;
    resumen.eachRow((row) => {
      if (String(row.getCell(1).value) === 'Primer vto pool') {
        foundValue = row.getCell(2).value;
      }
    });
    // The min between '2026-04-03' and '2026-04-10' is '2026-04-03'.
    // The cell stores a Date (UTC midnight) with format dd/mm/yyyy.
    // When re-read by exceljs, the .value is the Date object.
    if (foundValue instanceof Date) {
      expect((foundValue as Date).toISOString().slice(0, 10)).toBe('2026-04-03');
    } else {
      // Excel serial — 2026-04-03 is day 46115 since 1900-01-01
      expect(typeof foundValue).toBe('number');
    }
  });

  it('handles empty pool gracefully', async () => {
    const blob = await generateCertificateExcel(mockCert({ orders: [] }));
    const wb = await reload(blob);
    const resumen = wb.getWorksheet('Resumen')!;
    let primerVto: unknown = null;
    resumen.eachRow((row) => {
      if (String(row.getCell(1).value) === 'Primer vto pool') {
        primerVto = row.getCell(2).value;
      }
    });
    expect(String(primerVto)).toBe('—');

    const ordenes = wb.getWorksheet('Órdenes')!;
    // Row 1 is header; row 2 is TOTAL (no data rows).
    expect(String(ordenes.getCell('A2').value)).toBe('TOTAL');
    expect(Number(ordenes.getCell('F2').value)).toBe(0);
    expect(Number(ordenes.getCell('G2').value)).toBe(0);
  });
});
