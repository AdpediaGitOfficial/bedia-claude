import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

  dislayDetails: any;
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

  loadData(): void {
    this.commonService.getDataById('/category', this.id).subscribe({
      next: (response: any) => {
        if (response?.result) {
          this.dislayDetails = response.result;
        } else {
          this.notification.error('Error', 'Category not found');
          this.router.navigate(['/admin/categories']);
        }
      },
      error: () => {
        this.notification.error('Error', 'Failed to load category');
        this.router.navigate(['/admin/categories']);
      }
    });
  }
}
