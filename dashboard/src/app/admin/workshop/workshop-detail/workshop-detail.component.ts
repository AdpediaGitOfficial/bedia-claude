// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { CommonService } from 'src/app/shared/services/common.service';

// @Component({
//   selector: 'app-workshop-detail',
//   templateUrl: './workshop-detail.component.html',
//   styleUrls: ['./workshop-detail.component.css'],
// })
// export class WorkshopDetailComponent implements OnInit {

//   workshop: any;
//   imageUrls: SafeUrl[] = [];
//   bannerUrl?: SafeUrl;
//   isBannerVideo: boolean = false;
//   id!: string;
//    constructor(
//     private route: ActivatedRoute,
//     private commonService: CommonService,
//     private router: Router,
//     private notification: NzNotificationService,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.id = this.route.snapshot.paramMap.get('id')!;
//     this.loadWorkshop();
//   }

//   loadWorkshop(): void {
//     this.commonService.getDataById('/workshop', this.id).subscribe({
//       next: (res: any) => {
//         if (res?.success && res?.result) {
//           this.workshop = res.result;

//               // Banner
//         if (this.workshop.bannerImage) {
//           const url = this.workshop.bannerImage;

//           this.bannerUrl = this.sanitizer.bypassSecurityTrustUrl(url);

//           // detect file type
//           this.isBannerVideo = url.match(/\.(mp4|webm|ogg)$/i) !== null;
//         }

//         // Images
//         if (Array.isArray(this.workshop.images)) {
//           this.imageUrls = this.workshop.images.map((img: any) =>
//             this.sanitizer.bypassSecurityTrustUrl(img.image)
//           );
//         }


//         } else {
//           this.handleError('Workshop not found');
//         }
//       },
//       error: () => this.handleError('Failed to load workshop'),
//     });
//   }

//   private handleError(message: string): void {
//     this.notification.error('Error', message);
//     this.router.navigate(['/admin/workshops']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.css']
})
export class WorkshopDetailComponent implements OnInit {

  workshop: any;

  // Plain string — nz-image's nzSrc does not accept a SafeUrl object
  bannerUrl = '';
  isBannerVideo: boolean = false;
  workshopImages: any[] = [];
  journeyImages: any[] = [];
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadWorkshop();
  }

  loadWorkshop(): void {

    this.commonService.getDataById('/workshop', this.id).subscribe({

      next: (res: any) => {

        if (res?.success && res?.result) {

          this.workshop = res.result;

          /* -------- Banner -------- */

          if (this.workshop.bannerImage) {

            this.bannerUrl = this.workshop.bannerImage;

            this.isBannerVideo = this.bannerUrl.match(/\.(mp4|webm|ogg)$/i) !== null;
          }
  /* ---------- Workshop Images ---------- */
/* ---------- Workshop Images ---------- */
  if (Array.isArray(this.workshop.images)) {
    // Keep the URL as a string for nz-image compatibility
    this.workshopImages = this.workshop.images.map((img: any) => ({
      url: img.image, // Just use the string
      title: img.title
    }));
  }

  /* ---------- Journey Images ---------- */
  if (Array.isArray(this.workshop.journeyImage)) {
    // These are strings in your JSON response
    this.journeyImages = this.workshop.journeyImage.map((img: string) => ({
      url: img // Just use the string
    }));
  }
        } else {

          this.handleError('Workshop not found');

        }
      },

      error: () => this.handleError('Failed to load workshop')

    });
  }

  private handleError(message: string): void {

    this.notification.error('Error', message);

    this.router.navigate(['/admin/workshops']);

  }

}