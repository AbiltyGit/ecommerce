import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html'
})
export class OrderHistory implements OnInit {
  orders: any[] = [];
  userId: number = 0;
  loading: boolean = true;

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
      } catch (e) {}
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<any[]>(`/api/orders/user/${this.userId}`).subscribe({
      next: (data) => {
        // Sort orders by newest first
        this.orders = data.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  logout() {
    this.authService.logout();
  }
}
