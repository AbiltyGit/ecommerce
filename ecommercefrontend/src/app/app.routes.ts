import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { Dashboard } from './dashboard/dashboard';
import { Products } from './products/products';
import { CartComponent } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { OrderHistory } from './order-history/order-history';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminProducts } from './admin-products/admin-products';
import { AdminOrders } from './admin-orders/admin-orders';
import { AdminUsers } from './admin-users/admin-users';
import { AdminStores } from './admin-stores/admin-stores';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'chat', component: Chat, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: 'products', component: Products, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'order-history', component: OrderHistory, canActivate: [authGuard] },
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN', 'CORPORATE'] } },
  { path: 'admin/products', component: AdminProducts, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN', 'CORPORATE'] } },
  { path: 'admin/orders', component: AdminOrders, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN', 'CORPORATE'] } },
  { path: 'admin/users', component: AdminUsers, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: 'admin/stores', component: AdminStores, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
