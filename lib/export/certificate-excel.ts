import ExcelJS from 'exceljs';
import type { CertificateDetail, CertificateOrder } from '@/lib/types/certificate';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const MONEY_FMT = '$#,##0.00';
const PCT_FMT = '0.0000%';
const DATE_FMT = 'dd/mm/yyyy';

export async function generateCertificateExcel(cert: CertificateDetail): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Cashea CFB';
  wb.created = new Date();

  buildResumenSheet(wb.addWorksheet('Resumen'), cert);
  buildOrdenesSheet(wb.addWorksheet('Órdenes'), cert);

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], { type: XLSX_MIME });
}

function isoToDate(iso: string): Date {
  // YYYY-MM-DD → UTC midnight Date (avoids tz drift when Excel formats)
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function statusLabel(status: CertificateDetail['status']): string {
  switch (status) {
    case 'issued':
      return 'Activo';
    case 'matured':
      return 'Vencido';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Borrador';
  }
}

function firstMaturity(orders: CertificateOrder[]): string | null {
  if (orders.length === 0) return null;
  return orders.reduce(
    (acc, o) => (o.max_due_date < acc ? o.max_due_date : acc),
    orders[0].max_due_date,
  );
}

function buildResumenSheet(sheet: ExcelJS.Worksheet, cert: CertificateDetail): void {
  sheet.getColumn(1).width = 24;
  sheet.getColumn(2).width = 32;

  const fm = firstMaturity(cert.orders);

  type Row = { k: string; v: unknown; fmt?: string };
  const rows: Row[] = [
    { k: 'Código', v: cert.certificate_code },
    { k: 'Tipo', v: cert.certificate_type },
    { k: 'Estado', v: statusLabel(cert.status) },
    { k: 'Inversor', v: cert.investor.legal_name },
    { k: 'RIF', v: cert.investor.rif },
    { k: 'Capital', v: Number(cert.investor_capital), fmt: MONEY_FMT },
    { k: 'Tasa anual', v: Number(cert.annual_rate), fmt: PCT_FMT },
    { k: 'Plazo', v: `${cert.term_days} días` },
    { k: 'Precio', v: Number(cert.price) },
    { k: 'Nominal objetivo', v: Number(cert.nominal_target), fmt: MONEY_FMT },
    { k: 'Nominal real', v: Number(cert.nominal_actual), fmt: MONEY_FMT },
    { k: 'Pagado inversor', v: Number(cert.investor_paid), fmt: MONEY_FMT },
    { k: 'Residual', v: Number(cert.investor_returned), fmt: MONEY_FMT },
    { k: 'Rendimiento', v: Number(cert.investor_yield), fmt: MONEY_FMT },
    { k: 'Shortfall', v: Number(cert.shortfall_pct), fmt: PCT_FMT },
    { k: 'Emisión', v: isoToDate(cert.issue_date), fmt: DATE_FMT },
    { k: 'Vencimiento', v: isoToDate(cert.maturity_date), fmt: DATE_FMT },
    {
      k: 'Primer vto pool',
      v: fm ? isoToDate(fm) : '—',
      fmt: fm ? DATE_FMT : undefined,
    },
    { k: 'Emitido por', v: `${cert.issued_by.full_name} (${cert.issued_by.email})` },
    { k: 'Hash payload', v: cert.payload_hash },
  ];

  rows.forEach((r, i) => {
    const row = sheet.getRow(i + 1);
    row.getCell(1).value = r.k;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = r.v as ExcelJS.CellValue;
    if (r.fmt) row.getCell(2).numFmt = r.fmt;
  });
}

function buildOrdenesSheet(sheet: ExcelJS.Worksheet, cert: CertificateDetail): void {
  sheet.columns = [
    { header: 'ID orden', key: 'id', width: 14 },
    { header: 'Comercio', key: 'merchant', width: 32 },
    { header: 'RIF', key: 'rif', width: 14 },
    { header: 'Compra', key: 'purchase', width: 12 },
    { header: 'Últ. vto', key: 'maxDue', width: 12 },
    { header: '# Cuotas', key: 'cuotas', width: 10 },
    { header: 'Monto', key: 'monto', width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  let totalCuotas = 0;
  let totalMonto = 0;

  cert.orders.forEach((o) => {
    const row = sheet.addRow({
      id: o.external_order_id,
      merchant: o.merchant.current_name,
      rif: o.merchant.rif,
      purchase: isoToDate(o.purchase_date),
      maxDue: isoToDate(o.max_due_date),
      cuotas: o.installments.length,
      monto: Number(o.installments_sum_snapshot),
    });
    row.getCell('purchase').numFmt = DATE_FMT;
    row.getCell('maxDue').numFmt = DATE_FMT;
    row.getCell('monto').numFmt = MONEY_FMT;
    totalCuotas += o.installments.length;
    totalMonto += Number(o.installments_sum_snapshot);
  });

  const totalRow = sheet.addRow({
    id: 'TOTAL',
    merchant: '',
    rif: '',
    purchase: '',
    maxDue: '',
    cuotas: totalCuotas,
    monto: totalMonto,
  });
  totalRow.font = { bold: true };
  totalRow.getCell('monto').numFmt = MONEY_FMT;
}
