import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-faq-edit',
  templateUrl: './faq-edit.component.html',
  styleUrls: ['./faq-edit.component.css'],
})
export class FaqEditComponent implements OnInit {

  editForm!: FormGroup;
  faqId!: string;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.faqId = this.route.snapshot.params['id'];

    this.editForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      category: [''],
      isActive: [true, Validators.required],
    });

    this.loadFaq();
  }

  /* ---------- LOAD FAQ ---------- */
  loadFaq(): void {
    this.commonService.getDataById('/faq', this.faqId).subscribe({
      next: (res: any) => {
        const data = res.result;

        this.editForm.patchValue({
          question: data.question,
          answer: data.answer,
          category: data.category,
          isActive: data.isActive,
        });
      },
      error: () => {
        this.notification.error('Error', 'Failed to load FAQ');
        this.router.navigate(['/admin/faqs']);
      },
    });
  }

  /* ---------- SUBMIT ---------- */
  submitForm(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) return;

    this.isSubmitting = true;

    const payload = {
      question: this.editForm.value.question,
      answer: this.editForm.value.answer,
      category: this.editForm.value.category,
      isActive: this.editForm.value.isActive,
    };

    this.commonService.updateData('/faq', this.faqId, payload).subscribe({
      next: () => {
        this.notification.success('Success', 'FAQ updated successfully');
        this.router.navigate(['/admin/faqs']);
      },
      error: () => {
        this.notification.error('Error', 'Failed to update FAQ');
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
