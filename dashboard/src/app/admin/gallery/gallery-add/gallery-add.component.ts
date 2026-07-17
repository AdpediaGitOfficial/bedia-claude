import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery-add.component.html',
  styleUrls: ['./gallery-add.component.css'],
})
export class GalleryAddComponent implements OnInit {

  submitDataForm!: FormGroup;

  selectedImages: File[] = [];
  imagePreviewUrls: SafeUrl[] = [];
  imageError: string | null = null;

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.submitDataForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isActive: [true, Validators.required],
    });
  }

  /* ---------- IMAGE SELECTION ---------- */
  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.imageError = null;
    this.selectedImages = [];
    this.imagePreviewUrls = [];

    Array.from(input.files).forEach((file) => {
      const validation = this.fileUploadService.validateImageFile(file);
      if (!validation.valid) {
        this.imageError = validation.error;
        return;
      }

      this.selectedImages.push(file);

      this.imagePreviewUrls.push(
        this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        )
      );
    });

    input.value = '';
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  /* ---------- SUBMIT FORM ---------- */
  async submitForm(): Promise<void> {
    this.submitDataForm.markAllAsTouched();

    if (this.submitDataForm.invalid) return;

    if (!this.selectedImages.length) {
      this.imageError = 'At least one image is required';
      return;
    }

    this.isSubmitting = true;

    try {
      /*  Upload images */
      const uploadRes = await this.fileUploadService
        .uploadFileService(this.selectedImages, 'gallery')
        .toPromise();
      const imageUrls: string[] = uploadRes.result;
      const payload = {
        title: this.submitDataForm.value.title,
        description: this.submitDataForm.value.description,
        isActive: this.submitDataForm.value.isActive,
        images: imageUrls
      };

      /*  Save gallery */
      this.commonService.addData('gallery', payload).subscribe({
        next: () => {
          this.notification.success('Success', 'Gallery created successfully');
          this.router.navigate(['/admin/gallery']);
        },
        error: (err) => {
          this.notification.error(
            'Error',
            err?.error?.message || 'Failed to create gallery'
          );
        },
        complete: () => (this.isSubmitting = false),
      });

    } catch (error) {
      console.error(error);
      this.notification.error('Error', 'Image upload failed');
      this.isSubmitting = false;
    }
  }
}
