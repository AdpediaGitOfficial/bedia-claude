import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

// export class UserDetailComponent implements OnInit {
//   dislayDetails: any;
//   id: string;
//   imagePreviewUrl: SafeUrl | null = null;
//   age: number;
    
//   constructor(private route: ActivatedRoute,
//               private commonService: CommonService,
//               private router:Router,
//               private notification: NzNotificationService,
//               private sanitizer: DomSanitizer,
//             ) {}

//   ngOnInit(): void {
//     this.id = this.route.snapshot.paramMap.get('id');  
//     this.loadData();    
//   }

//   loadData(): void {
//     this.commonService.getDataById('/user', this.id).subscribe({
//       next: (response: any) => {
//         if (response.success && response.result) {
//           this.dislayDetails = response.result; 
//           if (this.dislayDetails.imageUrl) {
//             this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(environment.baseUrl+this.dislayDetails.avatar);
//           }
//         } else {
//           this.notification.error('Error', 'Data not found.');
//           this.router.navigate(['/admin/users']);
//         }
//       },
//       error: (err) => {
//         this.notification.error('Error', 'Failed to load data.');
//         this.router.navigate(['/admin/users']);
//       },
//     });
//   }

//   get showOfflinePaymentButton(): boolean {
//     const user = this.dislayDetails;
//     if (!user) return false;
  
//     const today = new Date();
//     const endDate = user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
  
//     return !user.subscribed || (endDate && endDate < today);
//   }
  
  

// }
export class UserDetailComponent implements OnInit {
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

  loadData(): void {
    this.commonService.getDataById('/user', this.id).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.displayDetails = response.result;
        } else {
          this.notification.error('Error', 'User not found');
          this.router.navigate(['/admin/users']);
        }
      },
      error: () => {
        this.notification.error('Error', 'Failed to load user');
        this.router.navigate(['/admin/users']);
      }
    });
  }
}
