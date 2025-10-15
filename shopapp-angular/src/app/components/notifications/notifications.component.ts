// File: notifications.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NotificationService } from '../../service/notification.service';
import { AuthService } from '../../service/auth.service'; // AuthService được inject
import { Subscription, interval, Subject } from 'rxjs'; // Thêm Subject
import { takeUntil } from 'rxjs/operators'; // Thêm takeUntil
import { HttpErrorResponse } from '@angular/common/http';

export interface AppNotification {
  id: number;
  icon: string;
  message: string;
  link?: string;
  createdAt: string;
  isRead: boolean;
  displayTime?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  unreadCount: number = 0;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  private pollingSubscription?: Subscription;
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy subscription

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService, // AuthService được inject
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkLoginStatusAndLoad();

    // Nếu bạn có cách nào đó để biết khi trạng thái đăng nhập thay đổi
    // (ví dụ: một sự kiện toàn cục, hoặc nếu AuthService có một EventEmitter đơn giản),
    // bạn có thể lắng nghe sự kiện đó ở đây để gọi lại checkLoginStatusAndLoad().
    // Nếu không, trạng thái chỉ được kiểm tra một lần khi component init.
    // Polling sẽ tự kiểm tra isLoggedIn trước mỗi lần gọi API.
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Phát tín hiệu hủy
    this.destroy$.complete();
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private checkLoginStatusAndLoad(): void {
    // Gọi trực tiếp phương thức isLoggedIn() từ AuthService
    this.isLoggedIn = this.authService.isLoggedIn(); // Giả sử AuthService có phương thức này
    console.log('NotificationsComponent - checkLoginStatusAndLoad - isLoggedIn:', this.isLoggedIn);
    debugger;

    if (this.isLoggedIn) {
      this.loadNotifications();
      this.startPolling();
    } else {
      this.clearNotifications();
    }
  }

  private clearNotifications(): void {
    this.notifications = [];
    this.unreadCount = 0;
  }

  private stopPolling(): void {
      if (this.pollingSubscription) {
          this.pollingSubscription.unsubscribe();
          this.pollingSubscription = undefined;
      }
  }

  startPolling(intervalTime: number = 30000): void {
    this.stopPolling(); // Dừng polling cũ nếu có

    // Chỉ bắt đầu polling nếu người dùng đã đăng nhập
    if (!this.isLoggedIn) {
        return;
    }

    this.pollingSubscription = interval(intervalTime)
      .pipe(takeUntil(this.destroy$)) // Tự động hủy khi component destroy
      .subscribe(() => {
        // Kiểm tra lại trạng thái đăng nhập trước mỗi lần poll,
        // phòng trường hợp token hết hạn hoặc người dùng đăng xuất ở tab khác
        if (this.authService.isLoggedIn()) {
          this.loadNotifications(true);
        } else {
          // Nếu không còn đăng nhập thì dừng polling và xóa thông báo
          this.isLoggedIn = false; // Cập nhật trạng thái cục bộ
          this.clearNotifications();
          this.stopPolling();
        }
      });
  }

  loadNotifications(isPolling: boolean = false): void {
    if (!this.isLoggedIn) {
      console.log("User not logged in, skipping notification load.");
      return;
    }

    if (!isPolling) {
      this.isLoading = true;
    }
    this.notificationService.getNotifications()
      .pipe(takeUntil(this.destroy$)) // Tự động hủy khi component destroy
      .subscribe({
        next: (response: any) => {
          if (response && response.data && Array.isArray(response.data)) {
            this.notifications = response.data.map((notiFromServer: any) => ({
              id: notiFromServer.id,
              icon: notiFromServer.icon,
              message: notiFromServer.message,
              link: notiFromServer.link,
              createdAt: notiFromServer.created_at || notiFromServer.createdAt,
              isRead: notiFromServer.is_read !== undefined ? notiFromServer.is_read : notiFromServer.isRead,
              displayTime: this.timeAgo(new Date(notiFromServer.created_at || notiFromServer.createdAt))
            }));
            this.updateUnreadCount();
          } else {
            this.notifications = [];
            this.unreadCount = 0;
            console.warn("Received unexpected data format for notifications:", response);
          }
          if (!isPolling) {
            this.isLoading = false;
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching notifications', err);
          if (!isPolling) {
            this.isLoading = false;
          }
        }
    });
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(notification: AppNotification): void {
    if (!this.isLoggedIn) return;

    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            const index = this.notifications.findIndex(n => n.id === notification.id);
            if (index > -1) {
              this.notifications[index].isRead = true;
              this.updateUnreadCount();
            }
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error marking notification as read for id:', notification.id, err);
          }
      });
    }
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  markAllAsRead(): void {
    if (!this.isLoggedIn || this.unreadCount === 0) return;

    this.notificationService.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
          this.updateUnreadCount();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error marking all notifications as read', err);
        }
    });
  }

  getIconClass(iconKeyOrEmoji: string): string {
    switch (iconKeyOrEmoji) {
      case 'order_placed': return 'fas fa-shopping-bag';
      case 'order_processing': return 'fas fa-cogs';
      case 'order_shipped': return 'fas fa-truck';
      case 'order_delivered': return 'fas fa-check-circle text-success';
      case 'order_cancelled': return 'fas fa-times-circle text-danger';
      case 'promotion': return 'fas fa-tags';
      case 'account_update': return 'fas fa-user-edit';
      case '🛍️': case '⏳': case '🚚': case '✅': case '❌': case '🔄': return '';
      default:
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/u;
        if (emojiRegex.test(iconKeyOrEmoji)) return '';
        return 'fas fa-bell';
    }
  }

  timeAgo(dateInput: Date | string): string {
    const date = (typeof dateInput === 'string') ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "Thời gian không xác định";

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " năm trước";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " tháng trước";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " ngày trước";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " giờ trước";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " phút trước";
    if (seconds < 10) return "vài giây trước";
    return Math.floor(seconds) + " giây trước";
  }
}