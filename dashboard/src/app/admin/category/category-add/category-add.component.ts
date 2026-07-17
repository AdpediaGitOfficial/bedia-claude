import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {

  submitDataForm!: FormGroup;
  selectedImages: File[] = [];      
  imagePreviewUrls: SafeUrl[] = []; 
  imageError: string | null = null;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
  this.submitDataForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      parentId: [null],
      description: [''],
      shortDescription:[''],
      isActive: [true, Validators.required],
      showOnHomepage: [false] 
    });

    this.loadCategories();
  }


  onImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedImages = [];
    this.imagePreviewUrls = [];

    Array.from(input.files).forEach(file => {
      const validation = this.fileUploadService.validateImageFile(file);
      if (!validation.valid) {
        this.imageError = validation.error;
        return;
      }

      this.imageError = null;
      this.selectedImages.push(file);

      this.imagePreviewUrls.push(
        this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        )
      );
    });
  }

  //Upload images ON SUBMIT 
  async submitForm(): Promise<void> {
    if (this.submitDataForm.invalid) {
      this.submitDataForm.markAllAsTouched();
      return;
    }

    let imageUrls: string[] = [];

    try {
      if (this.selectedImages.length > 0) {
        const uploadRes = await this.fileUploadService
          .uploadFileService(this.selectedImages, 'categories')
          .toPromise();

        imageUrls = uploadRes.result;
      }

      const payload = {
        title: this.submitDataForm.value.title,
        description: this.submitDataForm.value.description,
        shortDescription: this.submitDataForm.value.shortDescription,
        isActive: this.submitDataForm.value.isActive,
        image: imageUrls,
        showOnHomepage: this.submitDataForm.value.showOnHomepage,
      };

      this.categoryService.createCategory(payload).subscribe({
        next: () => {
          this.notification.success('Success', 'Category created successfully!');
          this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.notification.error('Error', 'Failed to create Category');
        }
      });

    } catch (error) {
      console.error(error);
      this.notification.error('Error', 'Image upload failed');
    }
  }
  loadCategories(): void {
  this.categoryService.getActiveCategories().subscribe({
    next: (res: any) => {
      this.categories = res.result.categories;      
    },
    error: () => {
      this.notification.error('Error', 'Failed to load categories');
    }
  });
}

}
