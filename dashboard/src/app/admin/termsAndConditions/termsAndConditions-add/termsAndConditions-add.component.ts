import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-terms-and-conditions-add',
  templateUrl: './termsAndConditions-add.component.html',
  styleUrls: ['./termsAndConditions-add.component.css'],
})
export class TermsAndConditionsAddComponent implements OnInit {
  submitDataForm!: FormGroup;
  isSubmitting = false;
  tinyApiKey = environment.tinyMceApiKey;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.submitDataForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      isActive: [true, Validators.required],
    });
  }

  /* TinyMCE configuration */
  tinyConfig = {
    height: 350,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | removeformat | help',
  };

  /* ---------- SUBMIT ---------- */
  submitForm(): void {
    this.submitDataForm.markAllAsTouched();

    if (this.submitDataForm.invalid) return;

    this.isSubmitting = true;

    const payload = {
      title: this.submitDataForm.value.title,
      content: this.submitDataForm.value.content,
      isActive: this.submitDataForm.value.isActive,
    };

    this.commonService.addData('terms-and-conditions', payload).subscribe({
      next: () => {
        this.notification.success(
          'Success',
          'Terms & Conditions created successfully'
        );
        this.router.navigate(['/admin/termsAndConditions']);
      },
      error: (err) => {
        this.notification.error(
          'Error',
          err?.error?.message || 'Failed to create'
        );
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
