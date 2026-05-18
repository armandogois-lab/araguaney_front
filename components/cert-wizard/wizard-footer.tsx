interface Props {
  step: 1 | 2 | 3;
  hasSimulation?: boolean;
  canContinue: boolean;
  busy?: boolean;
  onCancel: () => void;
  onBack: () => void;
  onContinue: () => void;
  onRecalculate: () => void;
  onConfirm: () => void;
}

export function WizardFooter({
  step,
  hasSimulation = false,
  canContinue,
  busy = false,
  onCancel,
  onBack,
  onContinue,
  onRecalculate,
  onConfirm,
}: Props) {
  return (
    <div className="border-border-subtle bg-card flex items-center justify-end gap-2 border-t px-7 py-4">
      {step === 1 && (
        <>
          <Btn onClick={onCancel} variant="ghost" disabled={busy}>
            Cancelar
          </Btn>
          <Btn onClick={onContinue} variant="primary" disabled={!canContinue || busy}>
            Continuar →
          </Btn>
        </>
      )}
      {step === 2 && (
        <>
          <Btn onClick={onCancel} variant="ghost" disabled={busy}>
            Cancelar
          </Btn>
          <Btn onClick={onBack} variant="ghost" disabled={busy}>
            ← Atrás
          </Btn>
          <Btn onClick={onRecalculate} variant="ghost" disabled={busy}>
            Recalcular
          </Btn>
          <div className="flex flex-col items-end gap-1">
            <Btn onClick={onConfirm} variant="primary" disabled={!hasSimulation || busy}>
              Crear borrador →
            </Btn>
            <p className="text-text-3 mt-2 text-[11px]">
              Se reservarán las órdenes y el certificado quedará pendiente de aprobación por un
              admin.
            </p>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <Btn onClick={onCancel} variant="ghost" disabled={busy}>
            Cancelar
          </Btn>
          <Btn onClick={onBack} variant="ghost" disabled={busy}>
            ← Atrás
          </Btn>
          <Btn onClick={onConfirm} variant="primary" disabled={!canContinue || busy}>
            Confirmar emisión{busy ? '…' : ''}
          </Btn>
        </>
      )}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'ghost';
  disabled?: boolean;
}) {
  const cls =
    variant === 'primary'
      ? 'bg-foreground text-background hover:opacity-90'
      : 'border-border-subtle bg-card text-text-2 hover:bg-subtle border';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-1.5 text-[12px] font-medium disabled:opacity-40 ${cls}`}
    >
      {children}
    </button>
  );
}
