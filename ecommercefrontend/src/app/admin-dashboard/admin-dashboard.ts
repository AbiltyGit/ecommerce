import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboard implements OnInit {
  stats: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.http.get('/api/dashboard/stats').subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: (err) => {
        this.error = 'Failed to load dashboard stats.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  goToProducts() { this.router.navigate(['/admin/products']); }
  goToOrders() { this.router.navigate(['/admin/orders']); }
  goToUsers() { this.router.navigate(['/admin/users']); }
  goToStores() { this.router.navigate(['/admin/stores']); }
  goToChat() { this.router.navigate(['/chat']); }
  logout() { this.authService.logout(); }
}

