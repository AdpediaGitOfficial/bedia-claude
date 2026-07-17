import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-terms-and-conditions-edit',
  templateUrl: './termsAndConditions-edit.component.html',
  styleUrls: ['./termsAndConditions-edit.component.css'],
})
export class TermsAndConditionsEditComponent implements OnInit {
  submitDataForm!: FormGroup;
  isSubmitting = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.submitDataForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      isActive: [true, Validators.required],
    });

    this.getData();
  }

  /* ---------- FETCH OLD DATA ---------- */
  getData() { 
    this.commonService.getDataById('/terms-and-conditions', this.id).subscribe({
      next: (res: any) => {
        const data = res.result;
        this.submitDataForm.patchValue({
          title: data.title,
          content: data.content,
          isActive: data.isActive,
        });
      },
      error: () => {
        this.notification.error('Error', 'Failed to load data');
        this.router.navigate(['/admin/termsAndConditions']);
      },
    });
  }

  /* ---------- UPDATE ---------- */
  submitForm(): void {
    this.submitDataForm.markAllAsTouched();
    if (this.submitDataForm.invalid) return;

    this.isSubmitting = true;

    const payload = this.submitDataForm.value;

    this.commonService
      .updateData('/terms-and-conditions', this.id, payload)
      .subscribe({
        next: () => {
          this.notification.success(
            'Success',
            'Terms & Conditions updated successfully'
          );
          this.router.navigate(['/admin/termsAndConditions']);
        },
        error: (err) => {
          this.notification.error(
            'Error',
            err?.error?.message || 'Update failed'
          );
        },
        complete: () => (this.isSubmitting = false),
      });
  }
}
