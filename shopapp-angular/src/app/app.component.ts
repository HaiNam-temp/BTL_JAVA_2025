import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule], // ✅ Cho phép điều hướng giữa các trang
  template: `<router-outlet></router-outlet>` // ✅ Nơi hiển thị các component dựa trên đường dẫn
})
export class AppComponent {}
