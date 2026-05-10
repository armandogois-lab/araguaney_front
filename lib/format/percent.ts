export function fmtPct(value: number | string, decimals = 1): string {
  const n = typeof value === 'string' ? Number(value) : value;
  return `${(n * 100).toFixed(decimals)}%`;
}
