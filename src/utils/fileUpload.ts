import { randomUUID } from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';

export async function uploadMerchantDocument(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  supabaseClient: SupabaseClient
): Promise<string> {
  const allowedMimeTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'application/octet-stream',
    'multipart/x-zip'
  ];

  if (!allowedMimeTypes.includes(mimeType) && !originalName.toLowerCase().endsWith('.zip')) {
    throw new Error('Only ZIP files are allowed.');
  }

  const ext = originalName.split('.').pop() ?? 'zip';
  const fileName = `${randomUUID()}.${ext}`;

  const { data, error } = await supabaseClient.storage
    .from('merchant-documents')
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      duplex: 'half'
    });

  if (error) {
    console.error('Storage upload error in uploadMerchantDocument:', error);
    throw new Error(error.message);
  }

  return fileName;
}
