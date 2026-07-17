import { Component, OnInit } from '@angular/core';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { DashboardService } from '../shared/services/dashboard.service';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  themeColors = this.colorConfig.get().colors;
  blue = this.themeColors.blue;
  blueLight = this.themeColors.blueLight;
  cyan = this.themeColors.cyan;
  gold = this.themeColors.gold;
  purple = this.themeColors.purple;

  totalUsers: number = 0;
  newUsersThisMonth: number = 0;
  currentMonthRevenue: number = 0;
  growthPercentage: number = 0;
  totalBookings: number = 0;
  totalOrders: number = 0;

  revenueChartData: Array<any> = [{ data: [], label: 'New Registrations' }];
  revenueChartLabels: Array<string> = [];
  revenueChartType = 'line';
  revenueChartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    hover: { mode: 'nearest', intersect: true },
    tooltips: { mode: 'index' },
    scales: {
      xAxes: [{
        gridLines: [{ display: false }],
        ticks: { display: true, fontColor: this.themeColors.grayLight, fontSize: 13, padding: 10 }
      }],
      yAxes: [{
        gridLines: {
          drawBorder: false,
          drawTicks: false,
          borderDash: [3, 4],
          zeroLineWidth: 1,
          zeroLineBorderDash: [3, 4]
        },
        ticks: {
          display: true,
          stepSize: 1,
          fontColor: this.themeColors.grayLight,
          fontSize: 13,
          padding: 10
        }
      }]
    }
  };

  revenueChartColors: Array<any> = [{
    backgroundColor: this.themeColors.transparent,
    borderColor: this.blue,
    pointBackgroundColor: this.blue,
    pointBorderColor: this.themeColors.white,
    pointHoverBackgroundColor: this.blueLight,
    pointHoverBorderColor: this.blueLight
  }];

  constructor(
    private colorConfig: ThemeConstantService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardStats();
    this.fetchNewUsersChart();
  }

  fetchDashboardStats(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (res: any) => {
        const data = res.result;
        this.totalUsers = data.totalUsers;
        this.newUsersThisMonth = data.newUsersThisMonth;
        this.currentMonthRevenue = data.currentMonthRevenue;
        this.growthPercentage = data.growthPercentage;
        this.totalBookings = data.totalBookings;
        this.totalOrders = data.totalOrders;
      },
      error: (err) => console.error('Error fetching dashboard stats:', err)
    });
  }

  fetchNewUsersChart(): void {
    this.dashboardService.getDailyNewUsersChart().subscribe({
      next: (res: any) => {
        this.revenueChartLabels = res.result.map((item: any) => item.date);
        this.revenueChartData = [{
          data: res.result.map((item: any) => item.count),
          label: 'New Registrations'
        }];
      },
      error: (err) => console.error('Error fetching chart data:', err)
    });
  }
}
