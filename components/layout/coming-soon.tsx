interface Props {
  message?: string;
}

export function ComingSoon({
  message = 'Esta sección estará disponible en próximos slices.',
}: Props) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="max-w-md text-center">
        <div className="mb-2 text-2xl font-semibold">Próximamente</div>
        <p className="text-text-3 text-sm">{message}</p>
      </div>
    </div>
  );
}
