import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { PackageService } from '../../../shared/services/package.service';
import { CommonService } from 'src/app/shared/services/common.service';

interface DataItem {
  packageName: string;  
  ageTo: string;
  ageFrom: string;
  description: string;
  status:  string;
}

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css'],
})
export class PackageListComponent implements OnInit {
    displayData: DataItem[] = [];
    dataList: DataItem[] = [];
    orderColumn = [
      {
          title: 'SI.No.',           
      },
    {
        title: 'Package Name',
    },
    {
      title: 'Age',
    },
    {
        title: 'Description',
    },  
    {
        title: 'Status',      
    },
    {
      title: 'Actions',      
    }
  ]
  constructor(private tableSvc : TableService,
     private packageService : PackageService,
     private commonService: CommonService,) {
  
  }
  ngOnInit(): void {
    this.fetchPackages();
  }

  fetchPackages(): void {
    this.packageService.getPackages().subscribe({
      next: (res: any) => {
        this.displayData = res.result;
        this.dataList = res.result; 
      },
      error: (err) => {
        console.error('Error fetching packages:', err);
      }
    });
  }

  deleteItem(endpoint: string, id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.commonService.deleteItem(endpoint, id).subscribe({
        next: () => {
          alert('Item deleted successfully');
          this.fetchPackages(); 
        },
        error: (err) => {          
          console.error('Error deleting item:', err);
          const errorMessage = err?.error?.message || 'Failed to delete the item';
          alert(errorMessage);
        },
      });
    }
  }

}
