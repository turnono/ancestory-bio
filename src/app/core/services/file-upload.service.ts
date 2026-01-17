import { Injectable, inject } from '@angular/core';
import { 
  Storage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  UploadTask,
  UploadTaskSnapshot
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

export interface UploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private storage = inject(Storage);

  /**
   * Upload a file to Firebase Storage
   * @param file The file to upload
   * @param path The storage path (e.g., 'genomic-files/enzyme-123')
   * @returns Observable of upload progress
   */
  uploadFile(file: File, path: string): Observable<UploadProgress> {
    const storageRef = ref(this.storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable(observer => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({ progress, snapshot });
        },
        (error) => {
          observer.error(error);
        },
        async () => {
          observer.complete();
        }
      );
    });
  }

  /**
   * Upload a file and get the download URL
   * @param file The file to upload
   * @param path The storage path
   * @returns Promise with upload result
   */
  async uploadFileAndGetUrl(file: File, path: string): Promise<UploadResult> {
    const storageRef = ref(this.storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(storageRef);
            resolve({
              url,
              path: `${path}/${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Delete a file from Firebase Storage
   * @param path The full storage path to the file
   */
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Validate file type
   * @param file The file to validate
   * @param allowedTypes Array of allowed MIME types
   * @returns true if valid, false otherwise
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });
  }

  /**
   * Validate file size
   * @param file The file to validate
   * @param maxSizeMB Maximum size in megabytes
   * @returns true if valid, false otherwise
   */
  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Format file size for display
   * @param bytes File size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
