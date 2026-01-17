import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService, UploadResult } from '../../core/services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload-container">
      <!-- Drop Zone -->
      <div 
        class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
        [class.border-purple-500]="isDragging"
        [class.border-gray-300]="!isDragging"
        [class.bg-purple-50]="isDragging"
        [class.dark:border-purple-400]="isDragging"
        [class.dark:border-gray-600]="!isDragging"
        [class.dark:bg-purple-900/10]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)">
        
        <input 
          #fileInput
          type="file"
          [accept]="accept"
          [multiple]="multiple"
          (change)="onFileSelected($event)"
          class="hidden">

        <div class="space-y-4">
          <!-- Icon -->
          <div class="flex justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <!-- Text -->
          <div>
            <button 
              type="button"
              (click)="fileInput.click()"
              class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              Click to upload
            </button>
            <span class="text-gray-600 dark:text-gray-400"> or drag and drop</span>
          </div>

          <!-- File Info -->
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ fileTypeLabel }} (max {{ maxSizeMB }}MB)
          </p>
        </div>
      </div>

      <!-- Upload Progress -->
      <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-700 dark:text-gray-300">Uploading...</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
            [style.width.%]="uploadProgress"></div>
        </div>
      </div>

      <!-- Uploaded Files -->
      <div *ngIf="uploadedFiles.length > 0" class="mt-4 space-y-2">
        <div *ngFor="let file of uploadedFiles" 
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clip-rule="evenodd" />
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button 
            type="button"
            (click)="removeFile(file)"
            class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FileUploadComponent {
  private fileUploadService = inject(FileUploadService);

  @Input() accept = '*/*';
  @Input() multiple = false;
  @Input() maxSizeMB = 10;
  @Input() storagePath = 'uploads';
  @Input() fileTypeLabel = 'Any file type';
  
  @Output() filesUploaded = new EventEmitter<UploadResult[]>();
  @Output() fileRemoved = new EventEmitter<UploadResult>();

  isDragging = false;
  uploadProgress = 0;
  uploadedFiles: UploadResult[] = [];
  errorMessage = '';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private async handleFiles(files: File[]): Promise<void> {
    this.errorMessage = '';

    // Validate files
    const allowedTypes = this.accept.split(',').map(t => t.trim());
    const validFiles = files.filter(file => {
      if (!this.fileUploadService.validateFileType(file, allowedTypes)) {
        this.errorMessage = `Invalid file type: ${file.name}`;
        return false;
      }
      if (!this.fileUploadService.validateFileSize(file, this.maxSizeMB)) {
        this.errorMessage = `File too large: ${file.name} (max ${this.maxSizeMB}MB)`;
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Upload files
    for (const file of validFiles) {
      try {
        this.uploadProgress = 0;
        const result = await this.fileUploadService.uploadFileAndGetUrl(file, this.storagePath);
        this.uploadedFiles.push(result);
        this.uploadProgress = 100;
        
        // Reset progress after a delay
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 1000);
      } catch (error: any) {
        this.errorMessage = error.message || 'Upload failed';
      }
    }

    this.filesUploaded.emit(this.uploadedFiles);
  }

  async removeFile(file: UploadResult): Promise<void> {
    try {
      await this.fileUploadService.deleteFile(file.path);
      this.uploadedFiles = this.uploadedFiles.filter(f => f.path !== file.path);
      this.fileRemoved.emit(file);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to remove file';
    }
  }

  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }
}
