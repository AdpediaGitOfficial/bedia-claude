import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-terms-and-conditions-list',
  templateUrl: './termsAndConditions-list.component.html',
  styleUrls: ['./termsAndConditions-list.component.css'],
})
export class TermsAndConditionsListComponent implements OnInit {
  displayData: any[] = [];

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  /* ---------- FETCH DATA ---------- */
  fetchData(): void {
    const paramsObj = '';

    this.commonService
      .getData(
        this.pageIndex,
        this.pageSize,
        'terms-and-conditions/adminAll',
        paramsObj
      )
      .subscribe({
        next: (res: any) => {
          this.displayData = res.result.termsAndConditions;
          this.total = res.result.totalCount;
        },
        error: (err) => {
          console.error('Error fetching data:', err);
        },
      });
  }

  /* ---------- DELETE ---------- */
  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.commonService.deleteItem('/terms-and-conditions', id).subscribe({
      next: () => {
        this.notification.success('Success', 'Deleted successfully');
        this.fetchData();
      },
      error: (err) => {
        this.notification.error(
          'Error',
          err?.error?.message || 'Failed to delete'
        );
      },
    });
  }

  /* ---------- PAGINATION ---------- */
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.fetchData();
  }
}
