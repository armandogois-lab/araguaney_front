export function fmtMoney(n: number, decimals: number | null = null): string {
  const d = decimals === null ? (Number.isInteger(n) ? 0 : 2) : decimals;
  const abs = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
  return n < 0 ? `-$${abs}` : `$${abs}`;
}

export function fmtMoney2(n: number): string {
  return fmtMoney(n, 2);
}
