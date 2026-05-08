export function UploadBatchUploading({ filename }: { filename: string }) {
  const label = filename || 'el archivo';
  return (
    <div className="px-7 py-[72px] text-center">
      <div className="border-neutral-bg border-t-side mx-auto mb-3.5 h-9 w-9 animate-spin rounded-full border-[2.5px]" />
      <div className="text-[13px] font-medium">Subiendo {label}…</div>
      <div className="text-text-3 mt-1 text-[11px]">
        Validando estructura, duplicados y reglas de negocio
      </div>
    </div>
  );
}
