import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

  submitDataForm!: FormGroup;
  categoryId!: string;
  selectedImages: File[] = [];
  imagePreviewUrls: SafeUrl[] = [];
  existingImages: string[] = [];
  imageError: string | null = null;
  categories: any[] = [];
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;

    this.submitDataForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      parentId: [null],
      description: [''],
      isActive: [true, Validators.required],
      showOnHomepage: [false, Validators.required],
       shortDescription: [''],
    });

    this.loadCategories();
    this.loadCategoryDetails();
  }

  loadCategoryDetails(): void {
     this.commonService.getDataById('/category',this.categoryId).subscribe({
    next: (res: any) => {
        const cat = res.result;

        this.submitDataForm.patchValue({
          title: cat.title,
          // parentId comes populated as {_id, title} — the dropdown values are id strings
          parentId: cat.parentId?._id ?? cat.parentId ?? null,
          description: cat.description,
          shortDescription: cat.shortDescription,
          isActive: cat.isActive,
          showOnHomepage: cat.showOnHomepage,
        });

        this.existingImages = cat.image || [];
      },
      error: () => {
        this.notification.error('Error', 'Failed to load category');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getActiveCategories().subscribe({
      next: (res: any) => {
         // A category cannot be its own parent
         this.categories = res.result.categories.filter(
           (c: any) => c._id !== this.categoryId
         );
      }
    });
  }

  onImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

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

  async submitForm(): Promise<void> {
    if (this.submitDataForm.invalid) {
      this.submitDataForm.markAllAsTouched();
      return;
    }

    let imageUrls = [...this.existingImages];

    try {
      if (this.selectedImages.length > 0) {
        const uploadRes = await this.fileUploadService
          .uploadFileService(this.selectedImages, 'categories')
          .toPromise();

        imageUrls = [...imageUrls, ...uploadRes.result];
      }

      const payload = {
        title: this.submitDataForm.value.title,
        parentId: this.submitDataForm.value.parentId,
        description: this.submitDataForm.value.description,
        isActive: this.submitDataForm.value.isActive,
        image: imageUrls,
        showOnHomepage: this.submitDataForm.value.showOnHomepage,
        shortDescription: this.submitDataForm.value.shortDescription,
      };
this.commonService.updateData('/category', this.categoryId, payload).subscribe({
        next: () => {
          this.notification.success('Success', 'Category updated successfully!');
          this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.notification.error('Error', 'Failed to update category');
        }
      });

    } catch (err) {
      this.notification.error('Error', 'Image upload failed');
    }
  }
  
removeExistingImage(index: number): void {
  if (confirm('Remove this image?')) {
    this.existingImages.splice(index, 1);
  }
}

}
