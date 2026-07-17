import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';

interface DataItem {
  reviewName: string;
  packageName: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
})
export class ReviewListComponent implements OnInit {
  displayData: DataItem[] = [];
  dataList: DataItem[] = [];
  apiUrl: string = environment.baseUrl;
  // Pagination variables
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;

  orderColumn = [
    {
      title: 'SI.No.',
    },
    {
      title: 'Name',
    },
    {
      title: 'Rating',
    },
    {
      title: 'Review',
    },
    {
      title: 'Review Time',
    },
    {
      title: 'Status',
    },
    {
      title: 'Actions',
    },
  ];
  constructor(
    private tableSvc: TableService,
    private reviewService: ReviewService,
    private router: Router,
    private commonService: CommonService,
  ) {}
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.reviewService.getReviews(this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        this.displayData = res.result.googleReviews;
        this.dataList = res.result.googleReviews;
        this.total = res.result.totalCount;
      },
      error: (err) => {
        console.error('Error fetching review:', err);
      },
    });
  }

  deleteItem(endpoint: string, id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.commonService.deleteItem(endpoint, id).subscribe({
        next: () => {
          alert('Item deleted successfully');
          this.fetchData();
        },
        error: (err) => {
          console.error('Error deleting item:', err);
          const errorMessage =
            err?.error?.message || 'Failed to delete the item';
          alert(errorMessage);
        },
      });
    }
  }
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchData();
  }

  isSyncing = false;

  syncReviews(): void {
    if (this.isSyncing) return;

    this.isSyncing = true;

    this.commonService.postAction('reviews/sync').subscribe({
      next: () => {
        this.isSyncing = false;
        this.fetchData();
      },
      error: () => {
        this.isSyncing = false;
      },
    });
  }
  toggleStatus(id: string, currentStatus: boolean): void {
    const newStatus = !currentStatus;

    this.commonService
      .updateData('/reviews', id, { isActive: newStatus })
      .subscribe({
        next: () => {
          console.log('Review status updated:', newStatus);
          this.fetchData();
        },
        error: (err) => {
          console.error('Error updating status:', err);
          alert('Failed to update status');
        },
      });
  }
}
