import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginDTO } from '../../dtos/user/login.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoginRespone } from '../../responses/user/login.response';
import { TokenService } from '../../service/token.service';
import { RoleService } from '../../service/role.service'; 
import { Role } from '../../models/role';
import { UserResponse } from '../../responses/user/user.response';
import { CartService } from '../../service/cart.service';
import { BaseComponent } from '../base/base.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../responses/api.response';
import { tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;

  //Login User
  // phoneNumber: string = '15122003';
  // password: string = '1234567';

  //Login Admin
  phoneNumber: string = '0123456789';
  password: string = '123456';
  showPassword: boolean = false;
  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
 

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({      
      next: (roles: Role[]) => { // Sử dụng kiểu Role[]
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger
      },  
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
  }
  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']); 
  }
  loginWithGoogle() {    
    debugger
    this.authService.authenticate('google').subscribe({
      next: (url: string) => {
        debugger
        // Chuyển hướng người dùng đến URL đăng nhập Google
        window.location.href = url;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi kết nối với Google',
          title: 'Lỗi Đăng Nhập'
        });
      }
    });
  }  
  
  loginWithFacebook() {         
    // Logic đăng nhập với Facebook
    debugger
    this.authService.authenticate('facebook').subscribe({
      next: (url: string) => {
        debugger
        // Chuyển hướng người dùng đến URL đăng nhập Facebook
        window.location.href = url;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi kết nối với Facebook',
          title: 'Lỗi Đăng Nhập'
        });
      }
    });
  }
  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
  
    this.userService.login(loginDTO).pipe(
      tap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        this.tokenService.setToken(token);
      }),
      switchMap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        return this.userService.getUserDetail(token).pipe(
          tap((apiResponse2: ApiResponse) => {
            this.userResponse = {
              ...apiResponse2.data,
              date_of_birth: new Date(apiResponse2.data.date_of_birth),
            };
  
            if (this.rememberMe) {
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
            }
  
            if (this.userResponse?.role.name === 'admin') {
              this.router.navigate(['/admin']);
            } else if (this.userResponse?.role.name === 'user') {
              this.router.navigate(['/']);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Lỗi khi lấy thông tin người dùng:', error?.error?.message ?? '');
            return of(null); // Tiếp tục chuỗi Observable
          })
        );
      }),
      finalize(() => {
        this.cartService.refreshCart();
      })
    ).subscribe({
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Sai thông tin đăng nhập',
          title: 'Lỗi Đăng Nhập'
        });
      }
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}