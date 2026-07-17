import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  private allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/heic',
    'image/heif',
    'image/avif',
    'image/x-icon',
  ];
  private maxFileSize = 4 * 1024 * 1024; // 4 MB

  validateImageFile(file: File): { valid: boolean; error: string | null } {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          'Only PDF, JPEG, JPG, PNG, WEBP, SVG, GIF, BMP, TIFF, HEIC, HEIF, AVIF, and ICO files are allowed.',
      };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'File size should not exceed 4 MB.' };
    }

    return { valid: true, error: null };
  }

  uploadFileService(
    files: File[],
    location: string,
    watermark: boolean = false,
  ) {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));
    const currentUser = localStorage.getItem('currentUser');

    const token = currentUser ? JSON.parse(currentUser).token : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `${environment.baseUrl}/upload?location=${location}&watermark=${watermark}`,
      formData,
      { headers },
    );
  }
}
