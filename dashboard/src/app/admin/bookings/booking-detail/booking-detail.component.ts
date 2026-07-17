import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {

  booking: any;
  id!: string;

  get hasGiftDetails(): boolean {
    const gift = this.booking?.giftDetails;
    if (!gift) {
      return false;
    }
    return Object.values(gift).some(
      (value) => value !== null && value !== undefined && value !== ''
    );
  }

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

    this.commonService.getDataById('/workshop/workshop-booking', this.id).subscribe({

      next: (response: any) => {

        if (response?.result) {
          this.booking = response.result;
        } else {
          this.notification.error('Error', 'Booking not found');
          this.router.navigate(['/admin/workshop-bookings']);
        }

      },

      error: () => {
        this.notification.error('Error', 'Failed to load booking');
        this.router.navigate(['/admin/workshop-bookings']);
      }

    });

  }
}