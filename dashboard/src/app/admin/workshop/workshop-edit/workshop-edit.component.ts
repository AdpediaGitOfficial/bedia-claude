import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-workshop-edit',
  templateUrl: './workshop-edit.component.html'
})
export class WorkshopEditComponent implements OnInit {
  weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
   existingImages: string[] = [];
   imageError: string | null = null;
   workshopForm = this.fb.group({
    title: ['', Validators.required],
    categoryId: ['', Validators.required],
    shortDescription: [''],
    description: [''],
    overview: [''],
    defaultSlots: this.fb.array([]),
    options: this.fb.array([]),
   // nonAvailabilityDates: [[]],
    nonAvailabilityDates: [null],
    nonAvailabilityDays: this.fb.array(
    this.weekDays.map(() => this.fb.control(false)),    
  ),
    // nonAvailabilityDays: this.fb.array([]),

    isActive: [true],
    showOnHomepage: [false]
  });

  id!: string;
  categories: any[] = [];
  bannerFile?: File;
  bannerPreview?: SafeUrl;
  selectedImages: File[] = [];
  imagePreviewUrls: SafeUrl[] = [];
  showHomepageToggle = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadCategories();
    this.loadWorkshop();
  }

  /* ================= GETTERS ================= */

  get defaultSlots(): FormArray {
    return this.workshopForm.get('defaultSlots') as FormArray;
  }

  get options(): FormArray {
    return this.workshopForm.get('options') as FormArray;
  }

  /* ================= LOAD WORKSHOP ================= */

  loadWorkshop(): void {
    this.commonService.getDataById('/workshop', this.id).subscribe(res => {
      const w = res.result;

      /* ---------- BASIC FIELDS ---------- */
      this.workshopForm.patchValue({
        title: w.title,
        categoryId: w.categoryId?._id, 
        shortDescription: w.shortDescription,
        description: w.description,
        overview: w.overview,
        isActive: w.isActive,
        nonAvailabilityDates: (w.nonAvailabilityDates || []).map(
          (d: string) => new Date(d)
        )
      });

      /* ---------- SLOTS ---------- */
      this.defaultSlots.clear();
      w.defaultSlots.forEach((s: any) => {
        this.defaultSlots.push(
          this.fb.group({
            label: [s.label, Validators.required],
            startTime: [this.parseTime(s.startTime), Validators.required],
            endTime: [this.parseTime(s.endTime), Validators.required],
            capacity: [s.capacity]
          })
        );
      });

      this.options.clear();
      w.options.forEach((o: any) => {
        this.options.push(
          this.fb.group({
            title: [o.title, Validators.required],
            price: [o.price, Validators.required],
            currency: [o.currency],
            priceDescription: [o.priceDescription, Validators.required]
          })
        );
      });

      if (w.bannerImage) {
        this.bannerPreview = this.sanitizer.bypassSecurityTrustUrl(
          environment.baseUrl + w.bannerImage
        );
      }

      if (w.images?.length) {
        this.existingImages = w.images;

        this.imagePreviewUrls = w.images.map((img: string) =>
          this.sanitizer.bypassSecurityTrustUrl(
            img.startsWith('http') ? img : environment.baseUrl + img
          )
        );
      }

      const daysArray = this.workshopForm.get('nonAvailabilityDays') as FormArray;

        daysArray.controls.forEach((control, index) => {
          const dayName = this.weekDays[index];
          control.setValue(
            w.nonAvailabilityDays?.includes(dayName) ?? false
          );
        });
      this.workshopForm.patchValue({
        showOnHomepage: w.showOnHomepage ?? false
      });
     
    });
  }

  /* ================= SUBMIT ================= */

  async submitForm() {
    if (this.workshopForm.invalid) {
      this.workshopForm.markAllAsTouched();
      return;
    }

    let banner = '';
   
    if (this.bannerFile) {
      const res = await this.fileUploadService
        .uploadFileService([this.bannerFile], 'workshops')
        .toPromise();
      banner = res.result[0];
    }

    let images: string[] = [...this.existingImages];

    if (this.selectedImages.length) {
      const res = await this.fileUploadService
        .uploadFileService(this.selectedImages, 'workshops')
        .toPromise();

      images = [...images, ...res.result];
    }
    const selectedDays = this.workshopForm.value.nonAvailabilityDays
      .map((checked: boolean, i: number) =>
        checked ? this.weekDays[i] : null
      )
      .filter((v: string | null) => v !== null);

    const payload = {
      ...this.workshopForm.value,
      defaultSlots: this.workshopForm.value.defaultSlots.map((s: any) => ({
        ...s,
        startTime: this.formatTime(s.startTime),
        endTime: this.formatTime(s.endTime)
      })),
      nonAvailabilityDays: selectedDays,
      nonAvailabilityDates: (this.workshopForm.value.nonAvailabilityDates || [])
        .map((d: Date) => d.toISOString().split('T')[0]),
      bannerImage: banner || undefined,
      images
    };
    if (!this.showHomepageToggle) {
      delete payload.showOnHomepage; 
    }

    this.commonService.updateData('/workshop', this.id, payload).subscribe(() => {
      this.notification.success('Success', 'Workshop updated successfully');
      this.router.navigate(['/admin/workshops']);
    });
  }

  /* ================= HELPERS ================= */

  loadCategories() {
  this.categoryService.getActiveCategories().subscribe(res => {
    this.categories = res.result.categories;

    const selectedCategory = this.categories.find(
      c => c._id === this.workshopForm.value.categoryId
    );

    this.showHomepageToggle = !!selectedCategory?.showOnHomepage;

    this.listenCategoryChange();
  });
}


  onImagesChange(event: any): void {
  const files = Array.from(event.target.files || []);

  files.forEach((file: any) => {
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

  addSlot() {
    this.defaultSlots.push(
      this.fb.group({
        label: ['', Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        capacity: [12]
      })
    );
  }

  removeSlot(i: number) {
    this.defaultSlots.removeAt(i);
  }

  addOption() {
    this.options.push(
      this.fb.group({
        title: ['', Validators.required],
        price: ['', Validators.required],
        currency: ['AED'],
        priceDescription: ['', Validators.required]
      })
    );
  }

  removeOption(i: number) {
    this.options.removeAt(i);
  }

  formatTime(date: Date): string {
    return date
      ? new Date(date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      : '';
  }

  parseTime(time: string): Date {
    const date = new Date();
    const [t, meridian] = time.split(' ');
    let [hours, minutes] = t.split(':').map(Number);

    if (meridian === 'PM' && hours !== 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0);
    return date;
  }

  onBannerChange(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  this.bannerFile = file;
  this.bannerPreview = this.sanitizer.bypassSecurityTrustUrl(
    URL.createObjectURL(file)
  );
}

removeExistingImage(index: number): void {
  if (confirm('Remove this image?')) {
    this.existingImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }
}

listenCategoryChange(): void {
  this.workshopForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
    const selectedCategory = this.categories.find(
      cat => cat._id === categoryId
    );

    if (selectedCategory?.showOnHomepage === true) {
      this.showHomepageToggle = true;
    } else {
      this.showHomepageToggle = false;
      this.workshopForm.patchValue({ showOnHomepage: false });
    }
  });
}


}
