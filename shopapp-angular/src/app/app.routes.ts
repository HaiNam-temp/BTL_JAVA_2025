import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-confirm/order.detail.component';
import { LoginComponent } from './components/login/login.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { UserProfileComponent } from './components/user.profile/user.profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MapComponent } from './components/map/map.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guard/auth.guard';
import { AdminGuardFn } from './guard/admin.guard';
import { OrderAdminComponent } from './components/admin/orders/order.admin.component';
import { CategoriesAdminComponent } from './components/admin/categories/categories.admin.component';
import { ProductsAdminComponent } from './components/admin/products/products.admin.component';
import { DetailOrdersAdminComponent } from './components/admin/detail-orders/detail.orders.admin.component';
import { UpdateCategoryAdminComponent } from './components/admin/categories/update/update.category.admin.component';
import { InsertCategoryAdminComponent } from './components/admin/categories/insert/insert.category.admin.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { PaymentCallbackComponent } from './payment-callback/payment-callback.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { UserAdminComponent } from './components/admin/user/user.admin.component';
import { InventoryStatsComponent } from './components/admin/inventory.stats/inventory.stats.component';
import { BestSellingProductsComponent } from './components/admin/best.selling.products/best.selling.products.component';
import { SalesStatsComponent } from './components/admin/sales.stats/sales.stats.component';
import { UpdateProductAdminComponent } from './components/admin/products/update/update.product.admin.component';
import { InsertProductAdminComponent } from './components/admin/products/insert/insert.product.admin.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/google/callback', component: AuthCallbackComponent },
  { path: 'auth/facebook/callback', component: AuthCallbackComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'products/:id', component: DetailProductComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
  { path: 'app-notifications', component: NotificationsComponent },
  { path: 'app-map', component: MapComponent },
  { path: 'purchase-history', component: PurchaseHistoryComponent },

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuardFn],
    children: [
      { path: 'orders', component: OrderAdminComponent },
      { path: 'categories', component: CategoriesAdminComponent },
      { path: 'products', component: ProductsAdminComponent },
      { path: 'orders/:id', component: DetailOrdersAdminComponent },
      { path: 'users', component: UserAdminComponent },
      {
              path: 'categories/update/:id',
              component: UpdateCategoryAdminComponent
          },
          {
              path: 'categories/insert',
              component: InsertCategoryAdminComponent
          },
          {   path: 'products/update/:id',
              component: UpdateProductAdminComponent
          },
          {
              path: 'products/insert',
              component: InsertProductAdminComponent
          },
      { path: 'inventory-stats', component: InventoryStatsComponent },
      { path: 'best-selling-products', component: BestSellingProductsComponent },
      { path: 'sales-stats', component: SalesStatsComponent },
      { path: '', redirectTo: 'orders', pathMatch: 'full' } // Optional: default
    ]
   },
   
  { path: 'payments/payment-callback', component: PaymentCallbackComponent }

];

