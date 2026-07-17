import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-termsAndConditions-detail',
  templateUrl: './termsAndConditions-detail.component.html',
  styleUrls: ['./termsAndConditions-detail.component.css'],
})
export class TermsAndConditionsDetailComponent implements OnInit {

  displayDetails: any;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  /* ---------- LOAD TermsAndConditions ---------- */
  loadData(): void {
    this.commonService.getDataById('/terms-and-conditions', this.id).subscribe({
      next: (response: any) => {
        if (response?.success && response?.result) {
          this.displayDetails = response.result;
        } else {
          this.handleError('TermsAndConditions not found');
        }
      },
      error: () => this.handleError('Failed to load TermsAndConditions'),
    });
  }

  private handleError(message: string): void {
    this.notification.error('Error', message);
    this.router.navigate(['/admin/termsAndConditions']);
  }
}
