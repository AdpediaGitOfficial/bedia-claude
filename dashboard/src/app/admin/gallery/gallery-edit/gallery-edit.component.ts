import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery-edit',
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.css'],
})
export class GalleryEditComponent implements OnInit {
  editForm!: FormGroup;
  galleryId!: string;

  /* Existing images */
  existingImages: string[] = [];
  existingImagePreviews: SafeUrl[] = [];

  /* New images */
  newImages: File[] = [];
  newImagePreviews: SafeUrl[] = [];

  imageError: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.galleryId = this.route.snapshot.params['id'];

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isActive: [true, Validators.required],
    });

    this.loadGallery();
  }

  /* ---------- LOAD GALLERY ---------- */
  loadGallery(): void {
    this.commonService.getDataById('/gallery', this.galleryId).subscribe({
      next: (res: any) => {
        const data = res.result;

        this.editForm.patchValue({
          title: data.title,
          description: data.description,
          isActive: data.isActive,
        });

        if (Array.isArray(data.images)) {
          this.existingImages = [...data.images];
          this.existingImagePreviews = data.images.map((img: string) =>
            this.sanitizer.bypassSecurityTrustUrl(
              environment.baseUrl + img
            )
          );
        }
      },
      error: () => {
        this.notification.error('Error', 'Failed to load gallery');
        this.router.navigate(['/admin/gallery']);
      },
    });
  }

  /* ---------- FILE SELECTION ---------- */
  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.imageError = null;

    Array.from(input.files).forEach((file) => {
      const validation = this.fileUploadService.validateImageFile(file);
      if (!validation.valid) {
        this.imageError = validation.error;
        return;
      }

      this.newImages.push(file);
      this.newImagePreviews.push(
        this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        )
      );
    });

    input.value = '';
  }

  /* ---------- REMOVE IMAGES ---------- */
  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
    this.existingImagePreviews.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
    this.newImagePreviews.splice(index, 1);
  }

  /* ---------- SUBMIT ---------- */
  async submitForm(): Promise<void> {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) return;

    this.isSubmitting = true;

    try {
      let uploadedImageUrls: string[] = [];

      if (this.newImages.length > 0) {
        const uploadRes = await this.fileUploadService
          .uploadFileService(this.newImages, 'gallery')
          .toPromise();

        uploadedImageUrls = uploadRes.result;
      }

      const finalImages = [
        ...this.existingImages,
        ...uploadedImageUrls
      ];

      const payload = {
        title: this.editForm.value.title,
        description: this.editForm.value.description,
        isActive: this.editForm.value.isActive,
        images: finalImages
      };

      this.commonService.updateData('/gallery', this.galleryId, payload)
        .subscribe({
          next: () => {
            this.notification.success('Success', 'Gallery updated successfully');
            this.router.navigate(['/admin/gallery']);
          },
          error: () => {
            this.notification.error('Error', 'Failed to update gallery');
            this.isSubmitting = false;
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
