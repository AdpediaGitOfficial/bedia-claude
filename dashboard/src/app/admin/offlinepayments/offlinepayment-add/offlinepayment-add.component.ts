import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PackageService } from 'src/app/shared/services/package.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-offlinepayment-add',
  templateUrl: './offlinepayment-add.component.html',
  styleUrls: ['./offlinepayment-add.component.css']
})
export class OfflinepaymentAddComponent implements OnInit {
  
  submitDataForm: FormGroup;
  packages: any[] = []; 
  selectedImage: File | null = null;
  imageError: string | null = null; 
  imagePreviewUrl: SafeUrl | null = null;
  selectedPackage: any = null;
  selectedPackageCost: any = null;
  studentId:string;
  studentName:string;

  constructor(private fb: FormBuilder,
    private packageService : PackageService,
    private router: Router,
    private notification: NzNotificationService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private commonService : CommonService,

    ) { }
  
    ngOnInit(): void {
      this.studentId = this.route.snapshot.params['id'];
      this.studentName = this.route.snapshot.params['fullName'];
      this.submitDataForm = this.fb.group({        
        paymentRef: ['', [Validators.required, Validators.minLength(3)]],
        paymentDate: [null, Validators.required],
        imageUpload: [''],
        amount: ['', Validators.required],
        description: [''],
      });
      this.fetchPackageData();     
    } 

    disableFutureDates = (current: Date): boolean => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set time to the end of today
      return current >= today; 
    };

    fetchPackageData(): void {      
      this.packageService.getActivePackages().subscribe({
        next: (res: any) => {
          this.packages = res.result;         
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });    
    }

  onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input?.files?.[0]) {
          const file = input.files[0];
          const validationResult = this.fileUploadService.validateImageFile(file);  
          if (!validationResult.valid) {
              this.imageError = validationResult.error;
              this.selectedImage = null;
              this.imagePreviewUrl = null; 
          } else {
              this.imageError = null;
              this.selectedImage = file;  
              const objectUrl = URL.createObjectURL(file);
              this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);       
          }
      }
  } 

  onPackageSelect(pkg: any): void {
    this.selectedPackage = pkg;
    this.selectedPackageCost = null;
    console.log('Selected Package:', pkg);
  }  
  
  onPackageCostSelect(paymentCost: any, pkg: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();    
    this.selectedPackage = pkg;  
    this.selectedPackageCost = paymentCost;
    this.submitDataForm.patchValue({ 
      packageId: pkg?._id || null, 
      packageCostId: paymentCost?._id || null 
    });
  }

  submitForm(): void {      
    for (const i in this.submitDataForm.controls) {
      if (this.submitDataForm.controls.hasOwnProperty(i)) {
        this.submitDataForm.controls[i].markAsDirty();
        this.submitDataForm.controls[i].updateValueAndValidity();
      }
    }
  
    if (this.submitDataForm.valid) {
      if (!this.selectedPackage || !this.selectedPackageCost) {
        this.notification.error('Error', 'Please select a package and package cost.');
        return;
      }
      const formData = new FormData();
      formData.append('paymentRef', this.submitDataForm.value.paymentRef);
      formData.append('paymentDate', moment(this.submitDataForm.value.paymentDate).format('YYYY-MM-DD'));
      formData.append('amount', this.submitDataForm.value.amount);
      formData.append('packageId', this.selectedPackage._id || this.selectedPackage.id || this.selectedPackage); 
      formData.append('packageCostId', this.selectedPackageCost._id); 
      formData.append('comment', this.submitDataForm.value.description || '');
      formData.append('studentId', this.studentId);
      
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
  
      this.commonService.addData('/subscription/add-offline-payment',formData).subscribe({
        next: (res: any) => {
          this.notification.success('Success', 'Offline payment added successfully.');
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.notification.error('Error', 'Failed to submit the offline payment. Please try again.');
          console.error('Error submitting form:', err);
        }
      });
    } else {
      this.notification.error('Error', 'Please fill all required fields.');
        console.error('Form is invalid');
        this.submitDataForm.markAllAsTouched();  
    }
  }    
}
