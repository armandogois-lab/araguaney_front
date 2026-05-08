import { getUploadSlot, processUploadedFile } from './batches';
import { getBrowserSupabase } from '@/lib/supabase/browser';

const BUCKET = 'excel-uploads';

/**
 * Client-side orchestration of the direct-to-Storage upload.
 *
 *   1. Server Action gives us a signed slot (~200 bytes round-trip).
 *   2. Browser PUTs the .xlsx straight to Supabase Storage — bypasses
 *      Vercel's 4.5 MB Server Action body cap entirely.
 *   3. Server Action notifies the back, which downloads the bytes and
 *      runs dedup → parse → ingest.
 */
export async function uploadBatchFile(
  file: File,
): Promise<{ code: string; rows_imported: number }> {
  const slot = await getUploadSlot();

  const supabase = getBrowserSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(slot.storage_path, slot.signed_upload_token, file, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  if (error) {
    throw new Error(`No se pudo subir el archivo: ${error.message}`);
  }

  return await processUploadedFile({
    storage_path: slot.storage_path,
    filename: file.name,
  });
}
