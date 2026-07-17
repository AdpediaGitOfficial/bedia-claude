import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PackageService } from 'src/app/shared/services/package.service';

@Component({
  selector: 'app-package-add',
  templateUrl: './package-add.component.html',
  styleUrls: ['./package-add.component.css']
})
export class PackageAddComponent implements OnInit {
  submitDataForm: FormGroup;
  isActive: string = 'true';    

  constructor(private fb: FormBuilder, private packageService : PackageService,
    private router: Router, private notification: NzNotificationService) { }
    packageCostList: Array<any> = [];
    
    ngOnInit(): void {
      this.submitDataForm = this.fb.group({
        packageName: ['', [Validators.required, Validators.minLength(3)]],
        ageFrom: ['', [Validators.required, Validators.min(1)]],
        ageTo: ['', [Validators.required, Validators.min(1)]],
        description: [''],
        isActive: [true, Validators.required],
        packageCosts: this.fb.array([
          this.createPackageCost() 
        ]),
      });     
      this.packageCostList = [
        { price: null, from: '', to: '', validity: null },
      ];
    }

    get packageCosts(): FormArray {
      return this.submitDataForm.get('packageCosts') as FormArray;
    }
  
    createPackageCost(): FormGroup {
      return this.fb.group({
        price: ['', [Validators.required, Validators.min(1)]],
        validity: ['', [Validators.required, Validators.min(1)]],
        from: ['', Validators.required],
        to: ['', Validators.required],
      });
    }
  
    addPackageCost(): void {
      this.packageCosts.push(this.createPackageCost());
    }
  
    removePackageCost(index: number): void {
      if (index > 0) {
        this.packageCosts.removeAt(index);
      }
    }
  
    submitForm(): void {      
      for (const i in this.submitDataForm.controls) {
        this.submitDataForm.controls[ i ].markAsDirty();
        this.submitDataForm.controls[ i ].updateValueAndValidity();
      }
      if (this.submitDataForm.valid) {
        const formData = this.submitDataForm.value;
        this.packageService.createPackage(formData).subscribe({
          next: (response) => {
            console.log('Package created successfully:', response);
            this.notification.success('Success', 'Package created successfully!');
            this.router.navigate(['/admin/packages']); 
          },
          error: (err) => {
            console.error('Error creating Package:', err);
            this.notification.error('Error', 'Failed to create Package. Please try again.');
          },
        });
      } 
      else {
        console.error('Form is invalid');
        this.submitDataForm.markAllAsTouched();     
      }
    }
}
