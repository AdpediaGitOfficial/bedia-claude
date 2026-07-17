import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

interface OpeningHoursItem {
  _id: string;
  title: string;
  days: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
}

@Component({
  selector: 'app-opening-hours-list',
  templateUrl: './opening-hours-list.component.html',
  styleUrls: ['./opening-hours-list.component.css']
})
export class OpeningHoursListComponent implements OnInit {

  displayData: OpeningHoursItem[] = [];

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  /* ---------- FETCH DATA ---------- */
  fetchData(): void {
      const paramsObj = '';   
   
     this.commonService.getData( this.pageIndex, this.pageSize, 'opening-hours/adminAll',paramsObj).subscribe({
        next: (res: any) => {
          this.displayData = res.result.openingHours || [];
          this.total = res.result.totalCount || 0;
        },
        error: (err) => {
          console.error('Error fetching opening hours:', err);
        }
      });
  }

  /* ---------- DELETE ---------- */
  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.commonService.deleteItem('/opening-hours', id).subscribe({
      next: () => {
        alert('Deleted successfully');
        this.fetchData();
      },
      error: (err) => {
        alert(err?.error?.message || 'Delete failed');
      }
    });
  }

  /* ---------- PAGINATION ---------- */
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchData();
  }
}