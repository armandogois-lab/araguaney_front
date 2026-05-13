interface Props {
  weekNumber: number;
  weekLabel: string;
  dayIndex: number;
  pctAssigned: number;
}

export function CycleBanner({ weekNumber, weekLabel, dayIndex, pctAssigned }: Props) {
  const pctText =
    pctAssigned > 0
      ? `${Math.round(pctAssigned * 100)}% del stock asignado`
      : 'Sin asignación todavía';
  const barWidth = pctAssigned > 0 ? `${Math.round(pctAssigned * 100)}%` : '0%';

  return (
    <div className="bg-card border-border-subtle flex flex-wrap items-center justify-between gap-4 rounded-xl border px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="bg-green-text inline-block h-2 w-2 animate-pulse rounded-full" />
        <div className="leading-snug">
          <div className="text-[13px] font-medium">
            Ciclo semanal · Semana {weekNumber} · {weekLabel}
          </div>
          <div className="text-text-3 text-[11px]">
            Cierra el viernes con certificado de barrido a Cashea
          </div>
        </div>
      </div>
      <div className="text-text-3 flex items-center gap-3 text-[11px] tabular-nums">
        <span className="text-text-2 font-medium">Día {dayIndex} de 5</span>
        <div className="bg-subtle h-1 w-[200px] overflow-hidden rounded-full">
          <div className="bg-foreground h-full" style={{ width: barWidth }} />
        </div>
        <span>{pctText}</span>
      </div>
    </div>
  );
}
