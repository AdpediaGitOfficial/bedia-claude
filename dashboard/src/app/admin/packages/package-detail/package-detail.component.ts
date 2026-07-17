import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  packageDetails: any;
  packageId: string;
    
  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private router:Router,
              private notification: NzNotificationService,
            ) {}

  ngOnInit(): void {
    this.packageId = this.route.snapshot.paramMap.get('id');  
    this.loadData();    
  }

  loadData(): void {
    this.commonService.getDataById('/package', this.packageId).subscribe({
      next: (response: any) => {
        if (response.success && response.result.length > 0) {
          this.packageDetails = response.result[0]; 
        } else {
          this.notification.error('Error', 'Package not found.');
          this.router.navigate(['/admin/packages']);
        }
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to load package.');
        this.router.navigate(['/admin/packages']);
      },
    });
  }
  
}
