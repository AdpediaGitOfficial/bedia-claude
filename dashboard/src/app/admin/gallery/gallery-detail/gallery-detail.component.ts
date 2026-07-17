import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css'],
})
export class GalleryDetailComponent implements OnInit {
  displayDetails: any;
  imageUrls: SafeUrl[] = [];
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private notification: NzNotificationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  loadData(): void {
    this.commonService.getDataById('/gallery', this.id).subscribe({
      next: (response: any) => {
        if (response?.success && response?.result) {
          this.displayDetails = response.result;

          if (Array.isArray(this.displayDetails.images)) {
            this.imageUrls = this.displayDetails.images.map((img: string) =>
              this.sanitizer.bypassSecurityTrustUrl(
                environment.baseUrl + img
              )
            );
          }
        } else {
          this.handleError('Gallery not found');
        }
      },
      error: () => this.handleError('Failed to load gallery'),
    });
  }

  private handleError(message: string): void {
    this.notification.error('Error', message);
    this.router.navigate(['/admin/galleries']);
  }
}
