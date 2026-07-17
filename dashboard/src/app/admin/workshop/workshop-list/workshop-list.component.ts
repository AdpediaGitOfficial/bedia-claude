import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.css']
})
export class WorkshopListComponent implements OnInit {

  displayData: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  loading = false;

  constructor(
    private commonService: CommonService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getWorkshops();
  }

  getWorkshops(): void {
    this.loading = true;
     const paramsObj = '';   
    
this.commonService.getData( this.pageIndex, this.pageSize, 'workshop/adminAll',paramsObj).subscribe({
      next: (res) => {
        this.displayData = res.result.workshops;
        this.total = res.result.totalCount;
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error', 'Failed to load workshops');
        this.loading = false;
      }
    });
  }
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getWorkshops();
  }

  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this workshop?')) return;

    this.commonService.deleteItem('/workshop', id).subscribe({
      next: () => {
        this.notification.success('Success', 'Workshop deleted successfully');
        this.getWorkshops();
      },
      error: () => {
        this.notification.error('Error', 'Failed to delete workshop');
      }
    });
  }
}
