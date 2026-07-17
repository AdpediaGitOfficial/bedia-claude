import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';

interface DataItem {
  studentName: string;
  packageName: string;
  description: string;
  status:  string;
}

@Component({
  selector: 'app-offlinepayment-list',
  templateUrl: './offlinepayment-list.component.html',
  styleUrls: ['./offlinepayment-list.component.css']
})

export class OfflinepaymentListComponent implements OnInit {
  displayData: DataItem[] = [];
  dataList: DataItem[] = [];
  apiUrl: string = environment.baseUrl;
  // Pagination variables
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number ;  

    orderColumn = [
    {
          title: 'SI.No.',           
    },
    {
        title: 'Student Name',
    },
    {
      title: 'Package',
    },    
    {
      title: 'Amount',
    },    
    {
        title: 'Entry Date',      
    },
    {
      title: 'Actions',      
    }
  ]
  constructor(private tableSvc : TableService, 
              private router : Router,
              private commonService: CommonService,) {
  
  }
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const paramsObj = { mode: 'offline' };
    this.commonService.getData( this.pageIndex, this.pageSize, '/subscription/offlinepayments',paramsObj).subscribe({
      next: (res: any) => {
        this.displayData = res.result.data;
        this.dataList = res.result.data; 
        this.total = res.result.totalCount; 
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
      }
    });
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;  
    this.fetchData();  
  }

}
