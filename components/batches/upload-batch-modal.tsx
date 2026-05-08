'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadBatch } from '@/lib/api/batches';
import { ApiError } from '@/lib/api/error';
import { UploadBatchDropzone } from './upload-batch-dropzone';
import { UploadBatchUploading } from './upload-batch-uploading';

const MAX_BYTES = 10 * 1024 * 1024;

export function UploadBatchModal({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadBatch,
    onSuccess: (batch) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success(
        `Lote ${batch.external_code} ingresado · ${batch.rows_imported.toLocaleString('en-US')} órdenes`,
      );
      onClose();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        const body = err.body as { message?: string } | null;
        setError(body?.message ?? 'No se pudo subir el lote');
      } else {
        setError('Error de red. Intenta de nuevo.');
      }
    },
  });

  function pickFile(file: File) {
    if (!/\.xlsx$/i.test(file.name)) return setError('Formato no soportado. Solo .xlsx.');
    if (file.size > MAX_BYTES) return setError('Archivo excede 10 MB.');
    if (file.size === 0) return setError('Archivo vacío.');
    setError(null);
    setFilename(file.name);
    const fd = new FormData();
    fd.set('file', file);
    mutation.mutate(fd);
  }

  const stage = mutation.status === 'pending' ? 'pending' : 'idle';

  return (
    <div
      data-testid="modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-12"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-[680px] overflow-hidden rounded-xl"
      >
        <div className="border-border-subtle flex items-start justify-between gap-4 border-b px-7 py-5">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.2px]">Subir lote de órdenes</h2>
            <div className="text-text-3 mt-1 text-[12px]">
              Adjunta el Excel exportado del backoffice de Cashea. Las órdenes ingresan al stock
              disponible para empaquetarse en certificados.
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-sweep-bg text-text-2 flex h-7 w-7 items-center justify-center rounded-[7px] text-[14px]"
          >
            ×
          </button>
        </div>

        {stage === 'idle' && <UploadBatchDropzone onPickFile={pickFile} error={error} />}
        {stage === 'pending' && <UploadBatchUploading filename={filename} />}
      </div>
    </div>
  );
}
