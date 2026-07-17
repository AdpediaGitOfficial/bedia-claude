import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css'],
})
export class GalleryListComponent implements OnInit {
  displayData: any[] = [];

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  apiUrl = environment.baseUrl;

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
     const paramsObj = '';   
    this.commonService.getData( this.pageIndex, this.pageSize, 'gallery/adminAll',paramsObj).subscribe({
    
      next: (res: any) => {
        this.displayData = res.result.galleries;
        this.total = res.result.totalCount;
      },
      error: (err) => {
        console.error('Error fetching gallery:', err);
      },
    });
  }

  getThumbnail(item: any): string | null {
    if (item.images && item.images.length) {
      return this.apiUrl + item.images[0];
    }
    return null;
  }

  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    this.commonService.deleteItem('/gallery', id).subscribe({
      next: () => {
        alert('Gallery deleted successfully');
        this.fetchData();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete gallery');
      },
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.fetchData();
  }
}
