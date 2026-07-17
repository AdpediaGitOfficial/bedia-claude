import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-opening-hours-form',
  templateUrl: './opening-hours-form.component.html',
  styleUrls: ['./opening-hours-form.component.css'],
})
export class OpeningHoursFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.isEditMode = true;
      this.getDataById();
    }
  }

  initForm() {
    this.form = this.fb.group({
      title: ['Opening Hours'],
      startDay: [null, Validators.required],
      endDay: [null, Validators.required],
      openTime: [null, Validators.required],
      closeTime: [null, Validators.required],
      isActive: [true, Validators.required],
    });
  }

  daysList = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  /* ---------- GET BY ID (UPDATED LIKE FAQ) ---------- */
  getDataById() {
    this.commonService.getDataById('/opening-hours', this.id).subscribe({
      next: (res: any) => {
        const data = res.result;

        let startDay = '';
        let endDay = '';

        if (data.days) {
          const parts = data.days.split('-');
          startDay = parts[0]?.trim();
          endDay = parts[1]?.trim();
        }

        this.form.patchValue({
          title: data.title,
          startDay: startDay,
          endDay: endDay,
          openTime: this.convertTimeStringToDate(data.openTime),
          closeTime: this.convertTimeStringToDate(data.closeTime),
          isActive: data.isActive,
        });
      },
      error: () => {
        this.notification.error('Error', 'Failed to load data');
        this.router.navigate(['/admin/opening-hours']);
      },
    });
  }

  /* ---------- SUBMIT ---------- */
  // submitForm(): void {
  //   this.form.markAllAsTouched();
  //   if (this.form.invalid) return;

  //   this.isSubmitting = true;

  //   const formValue = this.form.value;

  //   const payload = {
  //     ...formValue,
  //     days: `${formValue.startDay} - ${formValue.endDay}`,
  //   };

  //   delete payload.startDay;
  //   delete payload.endDay;

  //   if (this.isEditMode) {
  //     this.commonService
  //       .updateData('/opening-hours', this.id, payload)
  //       .subscribe({
  //         next: () => {
  //           this.notification.success('Success', 'Updated successfully');
  //           this.router.navigate(['/admin/opening-hours']);
  //         },
  //         error: (err) => {
  //           this.notification.error(
  //             'Error',
  //             err?.error?.message || 'Update failed',
  //           );
  //           this.isSubmitting = false;
  //         },
  //         complete: () => (this.isSubmitting = false),
  //       });
  //   } else {
  //     this.commonService.addData('opening-hours', payload).subscribe({
  //       next: () => {
  //         this.notification.success('Success', 'Created successfully');
  //         this.router.navigate(['/admin/opening-hours']);
  //       },
  //       error: (err) => {
  //         this.notification.error(
  //           'Error',
  //           err?.error?.message || 'Create failed',
  //         );
  //         this.isSubmitting = false;
  //       },
  //       complete: () => (this.isSubmitting = false),
  //     });
  //   }
  // }

  submitForm(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isSubmitting = true;

    const formValue = this.form.value;

    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');

      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours || 12;

      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const payload = {
      title: formValue.title,
      days: `${formValue.startDay} - ${formValue.endDay}`,
      openTime: formatTime(formValue.openTime),
      closeTime: formatTime(formValue.closeTime),
      isActive: formValue.isActive,
    };

    if (this.isEditMode) {
      this.commonService
        .updateData('/opening-hours', this.id, payload)
        .subscribe({
          next: () => {
            this.notification.success('Success', 'Updated successfully');
            this.router.navigate(['/admin/opening-hours']);
          },
          error: (err) => {
            this.notification.error(
              'Error',
              err?.error?.message || 'Update failed',
            );
            this.isSubmitting = false;
          },
          complete: () => (this.isSubmitting = false),
        });
    } else {
      this.commonService.addData('opening-hours', payload).subscribe({
        next: () => {
          this.notification.success('Success', 'Created successfully');
          this.router.navigate(['/admin/opening-hours']);
        },
        error: (err) => {
          this.notification.error(
            'Error',
            err?.error?.message || 'Create failed',
          );
          this.isSubmitting = false;
        },
        complete: () => (this.isSubmitting = false),
      });
    }
  }
  convertTimeStringToDate(time: string): Date {
    const [timePart, modifier] = time.split(' ');

    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }

    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date;
  }
}
