import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { ProfileComponent } from './profile/profile';
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
import { AdminAudit } from './admin-audit/admin-audit';
import { AdminCategories } from './admin-categories/admin-categories';
import { AdminReviews } from './admin-reviews/admin-reviews';
import { IndividualDashboard } from './individual-dashboard/individual-dashboard';
import { Shell } from './shell/shell';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  // Public route
  { path: 'login', component: Login },

  // Authenticated shell — all protected routes live here as children
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      // Individual
      { path: 'products', component: Products },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: Checkout },
      { path: 'order-history', component: OrderHistory },
      { path: 'profile', component: ProfileComponent },
      { path: 'my-dashboard', component: IndividualDashboard },
      { path: 'chat', component: Chat },

      // Admin (platform-wide analytics)
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },

      // Corporate + Admin shared panels
      {
        path: 'admin/dashboard',
        component: AdminDashboard,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN', 'CORPORATE'] }
      },
      {
        path: 'admin/products',
        component: AdminProducts,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN', 'CORPORATE'] }
      },
      {
        path: 'admin/orders',
        component: AdminOrders,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN', 'CORPORATE'] }
      },
      {
        path: 'admin/reviews',
        component: AdminReviews,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN', 'CORPORATE'] }
      },

      // Admin-only panels
      {
        path: 'admin/users',
        component: AdminUsers,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'admin/stores',
        component: AdminStores,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'admin/audit',
        component: AdminAudit,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'admin/categories',
        component: AdminCategories,
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },

      // Default redirect for authenticated users
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ]
  },

  // Catch-all
  { path: '**', redirectTo: '/login' }
];
