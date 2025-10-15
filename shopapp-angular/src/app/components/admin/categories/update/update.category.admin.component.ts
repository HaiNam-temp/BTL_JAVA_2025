import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category';

import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../service/category.service';
import { UpdateCategoryDTO } from '../../../../dtos/category/update.category';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../../responses/api.response';
import { BaseComponent } from '../../../base/base.component';

@Component({
  selector: 'app-detail.category.admin',
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class UpdateCategoryAdminComponent extends BaseComponent implements OnInit {
  categoryId: number = 0;
  updatedCategory: Category = {} as Category;
   ngOnInit(): void {    
    this.activatedRoute.paramMap.subscribe(params => {
      debugger
      this.categoryId = Number(params.get('id'));
      this.getCategoryDetails();
    });
    
  }
  
  getCategoryDetails(): void {
    this.categoryService.getDetailCategory(this.categoryId).subscribe({
    
      next: (apiResponse: ApiResponse) => {        
        debugger
        this.updatedCategory = { ...apiResponse.data };                        
      },
      complete: () => {
        
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải chi tiết danh mục',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }      
    });     
  }
  updateCategory() {
    const updateCategoryDTO: UpdateCategoryDTO = {
      name: this.updatedCategory.name,      
    };
    this.categoryService.updateCategory(this.updatedCategory.id, updateCategoryDTO).subscribe({
      next: (response: any) => {  
        debugger        
      },
      complete: () => {
        this.toastService.showToast({
          error: null,
          defaultMsg: 'Cập nhật danh mục thành công',
          title: 'Thành Công'
        });
        this.router.navigate(['/admin/categories']);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi cập nhật danh mục',
          title: 'Lỗi Cập Nhật'
        });
      }
    });  
  }  
}
