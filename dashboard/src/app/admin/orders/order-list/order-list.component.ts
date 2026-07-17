import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { UserService } from '../../../shared/services/user.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';


interface DataItem {
  name: string;  
  mobileNumber: string;
  email: string;
  avatar: string;
  dob: string;
  status:  string;
  parentName: string;
  subscription: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {  
  selectedSubscription: string = 'All';
  selectedStatus: string = 'All';
  searchInput: any;
  displayData: DataItem[] = [];
  dataList: DataItem[] = [];
  // Pagination variables
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number ;  
  dateRange: Date[] = [];
  filterType: 'all' | 'upcoming' | 'expired' = 'all';

  orderColumn = [
        {
            title: 'SI.No.',           
        },
         {
          title: 'Name',
          compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
        },
        {
          title: 'Joining Date',
          compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
        },    
     
      {
          title: 'Mobile Number',
          compare: (a: DataItem, b: DataItem) => a.mobileNumber.localeCompare(b.mobileNumber)
      },
      
      {
          title: 'Email',
          compare: (a: DataItem, b: DataItem) =>  a.email.localeCompare(b.email)
      },
      
    
      {
        title: 'Status',
        compare: (a: DataItem, b: DataItem) => a.dob.localeCompare(b.status)
    },
      {
          title: 'Actions',
          compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
      }
  ]
  constructor(private tableSvc : TableService, private userService: UserService, 
    private commonService:CommonService,  private route: ActivatedRoute,  
    ) {
     
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.filterType = data['filterType'] || 'all';
      this.fetchUsers();
    });
  }

  fetchUsers(): void { 
    const filters: any = {
      fullName: this.searchInput || undefined,
      subscribed: this.selectedSubscription !== 'All' ? this.selectedSubscription : undefined,
      isActive: this.selectedStatus !== 'All' ? this.selectedStatus : undefined,
    };
  
    if (this.filterType === 'upcoming') {
      filters.expiresIn7Days = true;
    } else if (this.filterType === 'expired') {
      filters.isExpired = true;
    }
  
    if (this.dateRange.length === 2) {
      filters.startDate = this.dateRange[0].toISOString().split('T')[0];
      filters.endDate = this.dateRange[1].toISOString().split('T')[0];
    }
    filters.role = 'user';
  
    this.displayData = [];
    this.userService.getUsers(filters, this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        this.displayData = res.result.data;
        this.dataList = res.result.data;
        this.total = res.result.totalCount; 
      //  console.log("displayData=", this.displayData);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }
  
  search(): void {
      this.pageIndex = 1; 
      this.fetchUsers();
  }  
  subscriptionChange(value: string): void {
      this.selectedSubscription = value;
      this.pageIndex = 1; 
      this.fetchUsers();
  }  
  statusChange(value: string): void {
      this.selectedStatus = value;
      this.pageIndex = 1; 
      this.fetchUsers();
  }
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;  
    this.fetchUsers();  
  } 
  onDateRangeChange(): void {
    this.pageIndex = 1;
    this.fetchUsers();
  }  

  exportUsers(): void {
    const filters: any = {
      fullName: this.searchInput || undefined,
      subscribed: this.selectedSubscription !== 'All' ? this.selectedSubscription : undefined,
      isActive: this.selectedStatus !== 'All' ? this.selectedStatus : undefined,
    };
    if (this.dateRange.length === 2) {      
      filters.startDate = this.dateRange[0].toISOString().split('T')[0]; 
      filters.endDate = this.dateRange[1].toISOString().split('T')[0];
    }  

    this.commonService.exportData(filters, 'student/export-students').subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error exporting users:', err);
      },
    });
  }

  isExpired(date: string | Date): boolean {
    if (!date) return false;
    const today = new Date();
    const endDate = new Date(date);
    return endDate < today;
  }

  deleteItem(endpoint: string, id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.commonService.deleteItem(endpoint, id).subscribe({
        next: () => {
          alert('Item deleted successfully');
          this.fetchUsers(); 
        },
        error: (err) => {          
          console.error('Error deleting item:', err);
          const errorMessage = err?.error?.message || 'Failed to delete the item';
          alert(errorMessage);
        },
      });
    }
  }
  
  unSubscribeStudent(endpoint: string, id: string): void {
    if (confirm('Are you sure you want to Unsubscribe this student?')) {
      this.userService.unSubscribe(endpoint, id).subscribe({
        next: () => {
          alert('Unsubscribed successfully');
          this.fetchUsers(); 
        },
        error: (err) => {
          console.error('Error:', err);
          const errorMessage = err?.error?.message || 'Failed to Unsubscribe';
          alert(errorMessage);
        },
      });
    }
  }  
  
  
}
