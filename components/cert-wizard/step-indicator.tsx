const STEPS: Array<{ n: 1 | 2 | 3; label: string }> = [
  { n: 1, label: 'Datos del inversor' },
  { n: 2, label: 'Simulación del pool' },
  { n: 3, label: 'Confirmación del borrador' },
];

function stateFor(stepN: 1 | 2 | 3, current: 1 | 2 | 3): 'done' | 'active' | 'pending' {
  if (stepN < current) return 'done';
  if (stepN === current) return 'active';
  return 'pending';
}

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="border-border-subtle bg-subtle flex items-center gap-3 border-b px-7 py-3">
      {STEPS.map((s, i) => {
        const state = stateFor(s.n, current);
        return (
          <div key={s.n} className="flex items-center gap-3">
            <div data-testid={`step-${s.n}`} data-state={state} className="flex items-center gap-2">
              <Bullet state={state} n={s.n} />
              <span
                className={
                  'text-[11px] font-medium ' +
                  (state === 'done'
                    ? 'text-green-text'
                    : state === 'active'
                      ? 'text-foreground'
                      : 'text-text-3')
                }
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="text-text-3 text-[11px]">→</span>}
          </div>
        );
      })}
    </div>
  );
}

function Bullet({ state, n }: { state: 'done' | 'active' | 'pending'; n: number }) {
  if (state === 'done') {
    return (
      <span className="bg-green-bg text-green-text inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
        ✓
      </span>
    );
  }
  const cls = state === 'active' ? 'bg-foreground text-background' : 'bg-neutral-bg text-text-3';
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${cls}`}
    >
      {n}
    </span>
  );
}
