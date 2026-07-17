import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css'],
})
export class FaqListComponent implements OnInit {

  displayData: any[] = [];

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  /* ---------- FETCH DATA ---------- */
  fetchData(): void {
    const paramsObj = '';

    this.commonService
      .getData(this.pageIndex, this.pageSize, 'faq/adminAll', paramsObj)
      .subscribe({
        next: (res: any) => {
          this.displayData = res.result.faqs;
          this.total = res.result.totalCount;
        },
        error: (err) => {
          console.error('Error fetching FAQs:', err);
        },
      });
  }

  /* ---------- DELETE ---------- */
  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    this.commonService.deleteItem('/faq', id).subscribe({
      next: () => {
        alert('FAQ deleted successfully');
        this.fetchData();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete FAQ');
      },
    });
  }

  /* ---------- PAGINATION ---------- */
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.fetchData();
  }
}
