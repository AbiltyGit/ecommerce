import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h2>Admin & Corporate Dashboard</h2>
      
      <div class="kpi-grid" *ngIf="stats">
        <div class="kpi-card">
          <h3>Total Revenue</h3>
          <p class="amount">\${{ stats.totalRevenue || 0 }}</p>
        </div>
        <div class="kpi-card">
          <h3>Total Products</h3>
          <p>{{ stats.totalProducts }}</p>
        </div>
        <div class="kpi-card">
          <h3>Total Orders</h3>
          <p>{{ stats.totalOrders || 0 }}</p>
        </div>
      </div>

      <div class="alerts-section" *ngIf="stats?.lowStockAlerts?.length > 0">
        <h3>Low Stock Alerts!</h3>
        <ul>
          <li *ngFor="let alert of stats.lowStockAlerts">
            <span class="warning-icon">⚠️</span> 
            <strong>{{ alert.name }}</strong> (Only {{ alert.stock_quantity }} left)
          </li>
        </ul>
      </div>

      <div class="actions">
        <button routerLink="/admin/products">Manage Products</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; font-family: Arial, sans-serif; }
    .kpi-grid { display: flex; gap: 20px; margin-bottom: 30px; }
    .kpi-card { background: #f8f9fa; border-left: 4px solid #3498db; padding: 20px; border-radius: 4px; flex: 1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .kpi-card h3 { margin: 0 0 10px 0; color: #7f8c8d; font-size: 14px; text-transform: uppercase; }
    .kpi-card p { margin: 0; font-size: 24px; font-weight: bold; color: #2c3e50; }
    .amount { color: #27ae60 !important; }
    .alerts-section { background: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; border: 1px solid #ffeeba; margin-bottom: 20px; }
    .alerts-section ul { list-style: none; padding: 0; }
    .alerts-section li { margin-bottom: 8px; }
    button { background: #2c3e50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
    button:hover { background: #34495e; }
  `]
})
export class AdminDashboard implements OnInit {
  stats: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/dashboard/stats').subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }
}
