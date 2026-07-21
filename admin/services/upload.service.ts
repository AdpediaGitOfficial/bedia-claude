import { api } from '@/lib/api';

/**
 * Upload one or more files to the backend (POST /upload?location=…, multipart
 * field `files`). Returns the public URLs the API responds with.
 */
export async function uploadFiles(files: File[], location = 'admin'): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  const { data } = await api.post(`/upload?location=${encodeURIComponent(location)}`, fd, {
    // Let the browser set multipart/form-data + boundary (override the JSON default).
    headers: { 'Content-Type': undefined as unknown as string },
  });
  return (data.result ?? []) as string[];
}
