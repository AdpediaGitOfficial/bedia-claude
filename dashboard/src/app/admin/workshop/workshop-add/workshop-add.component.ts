import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workshop-add',
  templateUrl: './workshop-add.component.html',
  styleUrls: ['./workshop-add.component.css']
})
export class WorkshopAddComponent implements OnInit {

  workshopForm!: FormGroup;
  categories: any[] = [];
  clayTypes: any[] = [];
  bannerFile!: File;
  bannerPreview!: SafeUrl;
  existingBannerUrl = '';
  journeyFile: File[] = [];
  journeyPreview: SafeUrl[] = [];
  existingJourneyImages: string[] = [];
  isBannerVideo: boolean = false;
  selectedImages: File[] = [];
  imagePreviewUrls: SafeUrl[] = [];
  
  isEditMode = false;
  workshopId!: string;

  weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

  this.workshopId = this.route.snapshot.paramMap.get('id') || '';
  this.isEditMode = !!this.workshopId;
  this.initForm();
  this.listenCategoryChange();
  this.loadClayTypes();
  this.loadCategories(); 
}

initForm(): void {
  this.workshopForm = this.fb.group({
    title: ['', Validators.required],
    categoryId: ['', Validators.required],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    overview: [''],
    defaultSlots: this.fb.array([]),
    options: this.fb.array([]),
    nonAvailabilityDates: [null],
    nonAvailabilityDays: this.fb.array(
      this.weekDays.map(() => this.fb.control(false))
    ),
    isActive: [true],
    showOnHomepage: [false],
    images: this.fb.array([]),
    includes: this.fb.array([]),
     moreDetails: this.fb.array([])
  });
}

loadWorkshop(): void {
  this.commonService.getDataById('/workshop', this.workshopId)
    .subscribe(res => {

      const workshop = res.result;

      // Patch simple fields
      this.workshopForm.patchValue({
        title: workshop.title,
        categoryId: workshop.categoryId?._id || workshop.categoryId,
        shortDescription: workshop.shortDescription,
        description: workshop.description,
        overview: workshop.overview,
        isActive: workshop.isActive,
        showOnHomepage: workshop.showOnHomepage,
        nonAvailabilityDates: workshop.nonAvailabilityDates
      });

      // Banner preview for edit — keep the stored URL so it is preserved on
      // submit when no new banner is selected
      if (workshop.bannerImage) {
        this.existingBannerUrl = workshop.bannerImage;
        this.bannerPreview = workshop.bannerImage;
        this.isBannerVideo = workshop.bannerImage.includes('.mp4');
      }
      if (workshop.journeyImage?.length) {
        this.existingJourneyImages = [...workshop.journeyImage];
        this.journeyPreview = workshop.journeyImage.map((img: string) =>
          this.sanitizer.bypassSecurityTrustUrl(img)
        );
      }

      
      // -------- Default Slots --------
      workshop.defaultSlots.forEach((slot: any) => {
        this.defaultSlots.push(
          this.fb.group({
            label: slot.label,
            startTime: new Date(`1970-01-01 ${slot.startTime}`),
            endTime: new Date(`1970-01-01 ${slot.endTime}`),
            capacity: slot.capacity
          })
        );
      });

      // -------- Options --------
     workshop.options.forEach((opt: any) => {
      const optionGroup = this.fb.group({
        clayType: opt.clayTypeId,
        title: opt.title,
        price: opt.price,
        currency: opt.currency,
        priceDescription: opt.priceDescription,
        description: opt.description,
        inclusions: this.fb.array(
          opt.inclusions?.map((inc: string) => this.fb.control(inc)) || []
        ),
        image: [null],
        imagePreview: [opt.image]
      });
      this.options.push(optionGroup);
    });
      // -------- Includes --------
      workshop.includes?.forEach((inc: any) => {
        this.includesArray.push(
          this.fb.group({
            title: inc.title
          })
        );
      });

      // -------- Images Preview (No Re-upload yet) --------
      workshop.images?.forEach((img: any) => {
        this.imagesArray.push(
          this.fb.group({
            file: [null],
            preview: [img.image],
            title: [img.title]
          })
        );
      });

      // -------- Non Availability Days --------
      const daysControls = this.nonAvailabilityDays.controls;
      this.weekDays.forEach((day, i) => {
        if (workshop.nonAvailabilityDays?.includes(day)) {
          daysControls[i].setValue(true);
        }
      });

      // -------- More Details --------
      workshop.moreDetails?.forEach((item: any) => {
      this.moreDetailsArray.push(
        this.fb.group({
          title: item.title,
          icon: null, 
          iconPreview: item.icon, 
          description: item.description
        })
      );
    });

    });

}

  /* ================= GETTERS ================= */

  get imagesArray(): FormArray {
    return this.workshopForm.get('images') as FormArray;
  }

  get includesArray(): FormArray {
    return this.workshopForm.get('includes') as FormArray;
  }

  get defaultSlots(): FormArray {
    return this.workshopForm.get('defaultSlots') as FormArray;
  }

  get options(): FormArray {
    return this.workshopForm.get('options') as FormArray;
  }

  get nonAvailabilityDays(): FormArray {
    return this.workshopForm.get('nonAvailabilityDays') as FormArray;
  }

  /* ================= SLOTS ================= */

  addSlot(): void {
    this.defaultSlots.push(
      this.fb.group({
        label: ['', Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        capacity: [12]
      })
    );
  }

  removeSlot(index: number): void {
    this.defaultSlots.removeAt(index);
  }

addOption(): void {
  const optionGroup = this.fb.group({
    clayType: [null],
    title: ['', Validators.required],
    price: [null, Validators.required],
    currency: ['AED'],
    priceDescription: [''],
    description: [''],
    inclusions: this.fb.array([]),
    image: [null],     
    imagePreview: ['']  
  });

  // Auto-fill title when clayType changes
  optionGroup.get('clayType')?.valueChanges.subscribe((clayId) => {
    const selectedClay = this.clayTypes.find(c => c._id === clayId);
    if (selectedClay) {
      optionGroup.patchValue({
        title: selectedClay.title
      });
    }
  });

  this.options.push(optionGroup);
}
  removeOption(index: number): void {
    this.options.removeAt(index);
  }
 
  onBannerChange(event: any): void {
  const file = event.target.files[0];
  if (!file) return;
 this.bannerFile = file;
  const fileType = file.type;

  // Check if video
  this.isBannerVideo = fileType.startsWith('video/');

  this.bannerPreview = this.sanitizer.bypassSecurityTrustUrl(
    URL.createObjectURL(file)
  );
}

onMoreDetailIconChange(event: any, index: number): void {
  const file = event.target.files[0];
  if (!file) return;

  const group = this.moreDetailsArray.at(index) as FormGroup;

  group.patchValue({
    icon: file,
    iconPreview: this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file)
    )
  });
}
 
  onImagesChange(event: any): void {
    // Append to the existing list — clearing here wiped previously saved images
    Array.from(event.target.files).forEach((file: any) => {
      const preview = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
      this.imagesArray.push(
        this.fb.group({
          file: [file],        
          preview: [preview],  
          title: ['']
        })
      );
    });
  }

  async submitForm(): Promise<void> {
    if (this.workshopForm.invalid) {
      this.workshopForm.markAllAsTouched();
      return;
    }

    try {
      // Keep the existing banner unless a new one was selected
      let bannerUrl = this.existingBannerUrl;
       if (this.bannerFile) {
        const res = await this.fileUploadService
          .uploadFileService([this.bannerFile], 'workshops')
          .toPromise();
        bannerUrl = res.result[0];
      }

    // Existing journey images stay; newly selected files are appended
    let journeyImageUrl: string[] = [...this.existingJourneyImages];
    if (this.journeyFile.length) {
      const res = await this.fileUploadService
        .uploadFileService(this.journeyFile, 'workshops')
        .toPromise();
      journeyImageUrl = [...journeyImageUrl, ...res.result];
    }

    let workshopImages: any[] = [];
if (this.imagesArray.length) {

  const files = this.imagesArray.controls
    .map(ctrl => ctrl.get('file')?.value)
    .filter(file => file); // only new files

  let uploadedUrls: string[] = [];

  if (files.length) {
    const res = await this.fileUploadService
      .uploadFileService(files, 'workshops')
      .toPromise();

    uploadedUrls = res.result;
  }

  let uploadIndex = 0;

  workshopImages = this.imagesArray.controls.map((ctrl) => {

    const file = ctrl.get('file')?.value;

    if (file) {
      return {
        image: uploadedUrls[uploadIndex++],
        title: ctrl.get('title')?.value
      };
    } else {
      return {
        image: ctrl.get('preview')?.value, // keep old image
        title: ctrl.get('title')?.value
      };
    }

  });
}

      const formattedSlots = this.workshopForm.value.defaultSlots.map((slot: any) => ({
        ...slot,
        startTime: this.formatTime(slot.startTime),
        endTime: this.formatTime(slot.endTime)
      }));

      const selectedDays = this.workshopForm.value.nonAvailabilityDays
        .map((checked: boolean, i: number) => checked ? this.weekDays[i] : null)
        .filter((v: string | null) => v !== null);
        const formattedDates = this.nonAvailabilityDates.map(d =>
          new Date(d).toISOString().split('T')[0]
        );

      let formattedOptions = [];

for (let opt of this.options.controls) {

  const optionValue = opt.value;
  let imageUrl = optionValue.imagePreview || '';

  if (optionValue.image) {
    const res = await this.fileUploadService
      .uploadFileService([optionValue.image], 'workshops')
      .toPromise();

    imageUrl = res.result[0];
  }

  formattedOptions.push({
    clayTypeId: optionValue.clayType,
    title: optionValue.title,
    price: optionValue.price,
    currency: optionValue.currency,
    priceDescription: optionValue.priceDescription,
    description: optionValue.description,
    inclusions: optionValue.inclusions,
    image: imageUrl
  });

  }

  let formattedMoreDetails = [];

for (let item of this.moreDetailsArray.controls) {

  let iconUrl = item.value.iconPreview || '';

  // if new file selected → upload
  if (item.value.icon) {
    const res = await this.fileUploadService
      .uploadFileService([item.value.icon], 'workshops')
      .toPromise();

    iconUrl = res.result[0];
  }

  formattedMoreDetails.push({
    title: item.value.title,
    icon: iconUrl,
    description: item.value.description
  });
}
      const payload = {
        ...this.workshopForm.value,
         options: formattedOptions,
        defaultSlots: formattedSlots,
        bannerImage: bannerUrl,
        images: workshopImages,
        nonAvailabilityDays: selectedDays,
        nonAvailabilityDates: formattedDates,
        journeyImage: journeyImageUrl,
        moreDetails: formattedMoreDetails

      };
      if (!this.showHomepageToggle) {
        delete payload.showOnHomepage;
      }


  if (this.isEditMode) {

  this.commonService.updateData('/workshop', this.workshopId, payload)
    .subscribe({
      next: () => {
        this.notification.success('Success', 'Workshop updated successfully');
        this.router.navigate(['/admin/workshops']);
      },
      error: () => {
        this.notification.error('Error', 'Failed to update workshop');
      }
    });

} else {

  this.commonService.addData('workshop', payload)
    .subscribe({
      next: () => {
        this.notification.success('Success', 'Workshop created successfully');
        this.router.navigate(['/admin/workshops']);
      },
      error: () => {
        this.notification.error('Error', 'Failed to create workshop');
      }
    });

}




    } catch {
      this.notification.error('Error', 'Image upload failed');
    }
  }


  loadCategories(): void {
  this.categoryService.getActiveCategories().subscribe(res => {
    this.categories = res.result.categories;

    if (this.isEditMode) {
      this.loadWorkshop();
    }
  });
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

  isInvalid(controlName: string): boolean {
    const control = this.workshopForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

onDatesChange(dates: Date[] | null): void {
  this.workshopForm.patchValue({
    nonAvailabilityDates: dates ?? []
  });
}
get nonAvailabilityDatesArray(): FormArray {
  return this.workshopForm.get('nonAvailabilityDates') as FormArray;
}
get nonAvailabilityDates(): Date[] {
  const value = this.workshopForm.get('nonAvailabilityDates')?.value;
  return Array.isArray(value) ? value : [];
}

removeDate(index: number): void {
  const dates = [...this.nonAvailabilityDates];
  dates.splice(index, 1);
  this.workshopForm.get('nonAvailabilityDates')?.setValue(
    dates.length ? dates : null
  );
}
showHomepageToggle = false;

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
loadClayTypes() {
  this.commonService.getAllData('clay-type/all').subscribe(res => {
    this.clayTypes = res.result.clayTypes;
  });
}
onClayTypeChange(clayId: string, index: number): void {
  const selectedClay = this.clayTypes.find(
    c => String(c._id) === String(clayId)
  );
  if (selectedClay) {
    const optionGroup = this.options.at(index) as FormGroup;
    optionGroup.patchValue({
      title: selectedClay.title
    });
  }
}

get moreDetailsArray(): FormArray {
  return this.workshopForm.get('moreDetails') as FormArray;
}

getInclusions(optionIndex: number): FormArray {
  return this.options.at(optionIndex).get('inclusions') as FormArray;
}

addInclusion(optionIndex: number): void {
  this.getInclusions(optionIndex).push(
    this.fb.control('', Validators.required)
  );
}

removeInclusion(optionIndex: number, inclusionIndex: number): void {
  this.getInclusions(optionIndex).removeAt(inclusionIndex);
}

addInclude(): void {
  this.includesArray.push(
    this.fb.group({
      title: ['', Validators.required]
    })
  );
}

removeInclude(index: number): void {
  this.includesArray.removeAt(index);
}

removeImage(index: number): void {
  this.imagesArray.removeAt(index);
}

removeJourneyImage(index: number): void {
  // journeyPreview lists existing images first, then newly selected files
  if (index < this.existingJourneyImages.length) {
    this.existingJourneyImages.splice(index, 1);
  } else {
    this.journeyFile.splice(index - this.existingJourneyImages.length, 1);
  }
  this.journeyPreview.splice(index, 1);
}

onJourneyChange(event: any): void {
  const files = event.target.files;

  if (!files.length) return;

  for (let file of files) {

    this.journeyFile.push(file);

    this.journeyPreview.push(
      this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      )
    );

  }

}

onOptionImageChange(event: any, index: number): void {

  const file = event.target.files[0];
  if (!file) return;

  const optionGroup = this.options.at(index) as FormGroup;

  optionGroup.patchValue({
    image: file,
    imagePreview: this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file)
    )
  });

}
addMoreDetail(): void {
  this.moreDetailsArray.push(
    this.fb.group({
      title: ['', Validators.required],
      icon: [null],              
      iconPreview: [''],         
      description: ['']
    })
  );
}

removeMoreDetail(index: number): void {
  this.moreDetailsArray.removeAt(index);
}

}



