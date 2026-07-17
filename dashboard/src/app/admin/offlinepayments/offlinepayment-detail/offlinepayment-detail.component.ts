import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-offlinepayment-detail',
  templateUrl: './offlinepayment-detail.component.html',
  styleUrls: ['./offlinepayment-detail.component.css']
})
export class OfflinepaymentDetailComponent implements OnInit {
  dislayDetails: any;
  id: string;
  imagePreviewUrl: SafeUrl | null = null;
    
  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private router:Router,
              private notification: NzNotificationService,
              private sanitizer: DomSanitizer,
            ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');  
    this.loadData();    
  }

  loadData(): void {
    this.commonService.getDataById('/subscription', this.id).subscribe({
      next: (response: any) => {
        if (response.success && response.result) {
          this.dislayDetails = response.result[0]; 
          if (this.dislayDetails.imageUrl) {
            this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(environment.baseUrl+this.dislayDetails.imageUrl);
          }
        } else {
          this.notification.error('Error', 'Data not found.');
          this.router.navigate(['/admin/offlinepayments']);
        }
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to load data.');
        this.router.navigate(['/admin/offlinepayments']);
      },
    });
  }
}
