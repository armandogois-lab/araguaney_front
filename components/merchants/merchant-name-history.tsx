import { Pill } from '@/components/ui/pill';
import type { MerchantNameHistoryItem } from '@/lib/types/merchant';

interface Props {
  items: MerchantNameHistoryItem[];
}

export function MerchantNameHistory({ items }: Props) {
  if (items.length <= 1) {
    return (
      <div className="bg-card border-border-subtle rounded-xl border p-5">
        <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
          Historial de nombres
        </div>
        <div className="text-text-3 text-[12px] italic">Sin cambios de nombre.</div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border-subtle rounded-xl border p-5">
      <div className="text-text-3 mb-3 text-[10px] uppercase tracking-wide">
        Historial de nombres
      </div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="text-text-3 text-[10px] uppercase tracking-wide">
            <th className="text-left font-medium">Nombre</th>
            <th className="text-left font-medium">Desde</th>
            <th className="text-left font-medium">Hasta</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-border-subtle border-t">
              <td className="py-2 pr-3">
                <span className="flex items-center gap-2">
                  <span>{it.name}</span>
                  {it.effective_to === null && <Pill variant="success">Actual</Pill>}
                </span>
              </td>
              <td className="py-2 pr-3 tabular-nums">{it.effective_from}</td>
              <td className="py-2 tabular-nums">{it.effective_to ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
