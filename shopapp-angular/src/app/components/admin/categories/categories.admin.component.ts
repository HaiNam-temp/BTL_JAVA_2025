import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../service/category.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../responses/api.response';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-categories.admin',
  imports: [],
  templateUrl: './categories.admin.component.html',
  styleUrl: './categories.admin.component.scss'
})
export class CategoriesAdminComponent extends BaseComponent implements OnInit {
  categories: Category[] = []; 

  ngOnInit() {
    this.getCategories(0, 100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger;
        this.categories = apiResponse.data;
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách danh mục',
          title: 'Lỗi Danh Mục'
        });
      }
    });
  }
  insertCategory() {
    debugger

    this.router.navigate(['/admin/categories/insert']);
  }


  updateCategory(categoryId: number) {
    debugger
    this.router.navigate(['/admin/categories/update', categoryId]);
  }
  deleteCategory(category: Category) {
    const confirmation = window
      .confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      debugger
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.toastService.showToast({
            error: null,
            defaultMsg: 'Xóa danh mục thành công',
            title: 'Thành Công'
          });
          location.reload();
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi khi xóa danh mục',
            title: 'Lỗi Xóa'
          });
        }
      });
    }
  }
}