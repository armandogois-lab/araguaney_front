import type { MerchantOrderStatus } from '@/lib/types/merchant';

interface Props {
  byStatus: Record<MerchantOrderStatus, number>;
}

const STATUS_ORDER: ReadonlyArray<{ key: MerchantOrderStatus; label: string }> = [
  { key: 'available', label: 'Disponibles' },
  { key: 'assigned', label: 'Asignadas' },
  { key: 'matured', label: 'Vencidas' },
  { key: 'defaulted', label: 'En default' },
];

export function MerchantStatusBreakdown({ byStatus }: Props) {
  const allZero = STATUS_ORDER.every(({ key }) => (byStatus[key] ?? 0) === 0);

  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">Órdenes por status</div>
      {allZero ? (
        <div className="text-text-3 text-[12px] italic">Sin órdenes registradas.</div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {STATUS_ORDER.map(({ key, label }) => (
            <li key={key} className="flex items-center justify-between text-[12.5px]">
              <span data-testid="status-label" className="text-text-2">
                {label}
              </span>
              <span className="tabular-nums">{(byStatus[key] ?? 0).toLocaleString('en-US')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
