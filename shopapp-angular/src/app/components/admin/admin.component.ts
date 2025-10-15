import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { BaseComponent } from '../base/base.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent extends BaseComponent implements OnInit {
  adminComponent: string = 'orders';
  userResponse?: UserResponse | null;

  // New properties for UI behavior
  sidebarCollapsed: boolean = false;
  loading: boolean = false;
  currentSection: string = 'Orders';

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    
    // Optional: navigate to default child route if none specified
    if (this.router.url === '/admin') {
      this.router.navigate(['/admin/orders']);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = null;
    this.router.navigate(['/']);
  }

  showAdminComponent(componentName: string): void {
    this.adminComponent = componentName;

    // Capitalize first letter for breadcrumb display
    this.currentSection = componentName.charAt(0).toUpperCase() + componentName.slice(1);

    // Navigate
    switch (componentName) {
      case 'orders':
        this.router.navigate(['/admin/orders']);
        break;
      case 'categories':
        this.router.navigate(['/admin/categories']);
        break;
      case 'products':
        this.router.navigate(['/admin/products']);
        break;
      case 'users':
        this.router.navigate(['/admin/users']);
        break;
    }
  }

  onActivate(event: any) {
    this.loading = false;
  }

  onDeactivate() {
    this.loading = true;
  }
}
