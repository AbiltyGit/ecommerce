import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { Dashboard } from './dashboard/dashboard';
import { Products } from './products/products';
import { CartComponent } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminProducts } from './admin-products/admin-products';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'chat', component: Chat, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: 'products', component: Products, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN', 'CORPORATE'] } },
  { path: 'admin/products', component: AdminProducts, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['ADMIN', 'CORPORATE'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
