import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html'
})
export class AdminOrders implements OnInit {
  orders: any[] = [];
  loading = true;
  userId: number = 0;
  userRole: string = '';
  
  // Status update state
  updatingOrderId: number | null = null;

  readonly statusFlow = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id;
        this.userRole = user.role;
      } catch (e) {}
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    let endpoint = '';

    if (this.userRole === 'ADMIN') {
      endpoint = '/api/orders';
    } else {
      // CORPORATE: fetch only orders that contain their store's products
      endpoint = `/api/orders/corporate/${this.userId}`;
    }

    this.http.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading = false;
      }
    });
  }

  advanceStatus(order: any) {
    const currentIdx = this.statusFlow.indexOf(order.status);
    if (currentIdx === -1 || currentIdx >= this.statusFlow.length - 1) return;

    const nextStatus = this.statusFlow[currentIdx + 1];
    this.updatingOrderId = order.id;

    this.http.patch(`/api/orders/${order.id}/status?status=${nextStatus}`, {}).subscribe({
      next: (updated: any) => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orders[idx].status = updated.status;
        this.updatingOrderId = null;
      },
      error: (err) => {
        alert('Failed to update order status.');
        this.updatingOrderId = null;
      }
    });
  }

  cancelOrder(order: any) {
    this.updatingOrderId = order.id;
    this.http.patch(`/api/orders/${order.id}/status?status=CANCELLED`, {}).subscribe({
      next: (updated: any) => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orders[idx].status = updated.status;
        this.updatingOrderId = null;
      },
      error: () => {
        alert('Failed to cancel order.');
        this.updatingOrderId = null;
      }
    });
  }

  canAdvance(status: string): boolean {
    const idx = this.statusFlow.indexOf(status);
    return idx !== -1 && idx < this.statusFlow.length - 1;
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}
