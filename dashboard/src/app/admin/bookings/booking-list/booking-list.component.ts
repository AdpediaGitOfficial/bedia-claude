import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})

export class BookingListComponent implements OnInit {

  bookingList: any[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;

  searchInput: string = '';
  bookingStatus: string = 'All';
  paymentStatus: string = 'All';
  dateRange: Date[] = [];

  loading: boolean = false;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {

    const filters: any = {
      search: this.searchInput || undefined,
      bookingStatus: this.bookingStatus !== 'All' ? this.bookingStatus : undefined,
      paymentStatus: this.paymentStatus !== 'All' ? this.paymentStatus : undefined,
    };

    if (this.dateRange.length === 2) {
      filters.startDate = this.dateRange[0].toISOString().split('T')[0];
      filters.endDate = this.dateRange[1].toISOString().split('T')[0];
    }

    this.loading = true;

    this.commonService
      .getData(this.pageIndex, this.pageSize, 'workshop/bookings/all', filters)
      .subscribe({
        next: (res: any) => {
          this.bookingList = res.result.data;
          this.total = res.result.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching bookings:', err);
          this.loading = false;
        },
      });
  }

  search(): void {
    this.pageIndex = 1;
    this.fetchBookings();
  }

  bookingStatusChange(value: string): void {
    this.bookingStatus = value;
    this.pageIndex = 1;
    this.fetchBookings();
  }

  paymentStatusChange(value: string): void {
    this.paymentStatus = value;
    this.pageIndex = 1;
    this.fetchBookings();
  }

  onDateRangeChange(): void {
    this.pageIndex = 1;
    this.fetchBookings();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.fetchBookings();
  }
}