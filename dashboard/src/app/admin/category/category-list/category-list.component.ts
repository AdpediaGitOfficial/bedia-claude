import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { CategoryService} from 'src/app/shared/services/category.service'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';

interface CategoryItem {
  _id: string;
  title: string;
  image: string[];
  description?: string;
  parentId?: string | null;
   parentName?: string; 
  isActive: boolean;
}


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  displayData: CategoryItem[] = [];
  apiUrl: string = environment.baseUrl;

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  orderColumn = [
    { title: 'SI.No.' },
    { title: 'Category Name' },
    { title: 'Parent Category' },
    { title: 'Status' },
    { title: 'Actions' }
  ];

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
  this.categoryService.getCategories(this.pageIndex, this.pageSize).subscribe({
    next: (res: any) => {
      const categories = res.result.categories;

      // Create ID → Name map
      const categoryMap = new Map<string, string>();
      categories.forEach((cat: CategoryItem) => {
        categoryMap.set(cat._id, cat.title);
      });

      // Attach parent name
      this.displayData = categories.map((cat: CategoryItem) => ({
        ...cat,
        parentName: cat.parentId
          ? categoryMap.get(cat.parentId) || '—'
          : 'Main Category'
      }));

      this.total = res.result.totalCount;
    },
    error: (err) => {
      console.error('Error fetching categories:', err);
    }
  });
}


  deleteItem(id: string): void {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.commonService.deleteItem('/category', id).subscribe({
      next: () => {
        alert('Category deleted successfully');
        this.fetchData();
      },
      error: (err) => {
        alert(err?.error?.message || 'Delete failed');
      }
    });
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchData();
  }
}

