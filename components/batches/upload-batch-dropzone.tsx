'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { UploadBatchRecent } from './upload-batch-recent';

interface Props {
  onPickFile: (file: File) => void;
  error: string | null;
}

export function UploadBatchDropzone({ onPickFile, error }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onPickFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onPickFile(file);
  }

  return (
    <div className="px-7 py-7">
      {error && (
        <div
          role="alert"
          className="bg-warn-bg text-warn-text mb-3 rounded-md px-3 py-2 text-[12px]"
        >
          {error}
        </div>
      )}

      <div
        data-testid="dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={
          'cursor-pointer rounded-xl border-[1.5px] border-dashed px-6 py-14 text-center transition-colors ' +
          (dragOver ? 'border-side bg-yellow/30' : 'border-black/20 bg-subtle')
        }
      >
        <input ref={inputRef} type="file" accept=".xlsx" onChange={onChange} className="hidden" />
        <div className="bg-card border-border-strong relative mx-auto mb-3.5 flex h-[54px] w-[46px] items-end justify-center rounded-md border-[0.5px] p-1.5">
          <div className="absolute top-1.5 right-1.5 left-1.5 flex h-[18px] items-center justify-center rounded-sm bg-[#1F6E43] text-[9px] font-semibold tracking-wide text-white">
            XLS
          </div>
        </div>
        <div className="mb-1 text-[14px] font-medium">
          Arrastra el archivo o haz click para seleccionarlo
        </div>
        <div className="text-text-3 text-[12px]">Acepta .xlsx · hasta 32 MB</div>
      </div>

      <UploadBatchRecent />
    </div>
  );
}
