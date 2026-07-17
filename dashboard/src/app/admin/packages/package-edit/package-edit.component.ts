import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PackageService } from 'src/app/shared/services/package.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.css']
})
export class PackageEditComponent implements OnInit {
  editDataForm: FormGroup;
  packageId: string;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.packageId = this.route.snapshot.paramMap.get('id');
    this.editDataForm = this.fb.group({
      packageName: ['', [Validators.required, Validators.minLength(3)]],
      ageFrom: ['', [Validators.required, Validators.min(1)]],
      ageTo: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      isActive: [true, Validators.required],
      packageCosts: this.fb.array([])
    });

    this.loadPackageData();
  }

  get packageCosts(): FormArray {
    return this.editDataForm.get('packageCosts') as FormArray;
  }

  createPackageCost(): FormGroup {
    return this.fb.group({
      price: ['', [Validators.required, Validators.min(1)]],
      validity: ['', [Validators.required, Validators.min(1)]],
      from: ['', Validators.required],
      to: ['', Validators.required],
    });
  }

  loadPackageData(): void {
    this.commonService.getDataById('/api/package', this.packageId).subscribe({
      next: (response: any) => {
        if (response.success && response.result.length > 0) {
          const packageData = response.result[0]; 
          this.editDataForm.patchValue({
            packageName: packageData.packageName,
            ageFrom: packageData.ageFrom,
            ageTo: packageData.ageTo,
            description: packageData.description,
            isActive: packageData.isActive,
          });  
          this.packageCosts.clear();  
          packageData.packageCosts.forEach((cost: any) => {
            const costGroup = this.createPackageCost();
            //costGroup.patchValue(cost);
            costGroup.patchValue({
              ...cost,
              from: cost.from.split('T')[0],
              to: cost.to.split('T')[0],    
            });
            this.packageCosts.push(costGroup);
          });
        } else {
          this.notification.error('Error', 'Failed to load package.');
          this.router.navigate(['/admin/packages']);          
        }
      },
      error: (err) => { 
        this.notification.error('Error', 'Failed to load package.');
        this.router.navigate(['/admin/packages']);     
      },
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
    if (this.editDataForm.valid) {
      const formData = this.editDataForm.value;
      this.commonService.updateData('/api/package', this.packageId, formData).subscribe({
        next: () => {
          this.notification.success('Success', 'Package updated successfully!');
          this.router.navigate(['/admin/packages']);
        },
        error: (err) => {
          console.error('Error updating package:', err);
          this.notification.error('Error', 'Failed to update package. Please try again.');
        }
      });
    } else {
      this.editDataForm.markAllAsTouched();
    }
  }
}
