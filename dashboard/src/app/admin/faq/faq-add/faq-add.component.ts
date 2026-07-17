import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-faq-add',
  templateUrl: './faq-add.component.html',
  styleUrls: ['./faq-add.component.css'],
})
export class FaqAddComponent implements OnInit {

  faqForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      category: [''],
      isActive: [true, Validators.required],
    });
  }

  submitForm(): void {
    this.faqForm.markAllAsTouched();

    if (this.faqForm.invalid) return;

    this.isSubmitting = true;

    const payload = {
      question: this.faqForm.value.question,
      answer: this.faqForm.value.answer,
      category: this.faqForm.value.category,
      isActive: this.faqForm.value.isActive,
    };

    this.commonService.addData('faq', payload).subscribe({
      next: () => {
        this.notification.success('Success', 'FAQ added successfully');
        this.router.navigate(['/admin/faqs']);
      },
      error: (err) => {
        this.notification.error(
          'Error',
          err?.error?.message || 'Failed to add FAQ'
        );
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
