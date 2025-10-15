import { Component, ViewChild } from '@angular/core';
import { FooterComponent } from './../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [FooterComponent, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  //Khai báo biến tương ứng với các trường dữ liệu của form đăng ký
  phoneNumber: string;
  password: string;
  retypePassword: string;
  address: string;
  fullName: string
  isAccepted: boolean;
  dateOfBirth: Date;
  //Hàm khởi tạo của component
  constructor(private router: Router, private UserService: UserService) {
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.address = '';
    this.fullName = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(1990);
    //inject

  }

  register() {
    const message = `Phone: ${this.phoneNumber}, 
    Password: ${this.password},
     Address: ${this.address},
      Full name: ${this.fullName},
       Is accepted: ${this.isAccepted},
        Date of birth: ${this.dateOfBirth}`;
    debugger

    

    const registerDTO:RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }

    this.UserService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        this.router.navigate(['/login']);

      },
      complete: () => { debugger },
      error: (error: any) => {
        alert(`Register failed! Error:  + ${error.error}`);
      }});
  }

  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const birthDate = new Date(this.dateOfBirth); // Convert from string to Date
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'underAge': true });
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
