import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-individual-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './individual-dashboard.html'
})
export class IndividualDashboard implements OnInit {
  orders: any[] = [];
  userId: number = 0;
  loading: boolean = true;
  error: string | null = null;
  
  totalSpent: number = 0;
  totalOrders: number = 0;
  totalItems: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
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
        this.zone.run(() => {
          this.orders = data;
          this.calculateStats();
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.renderCharts(), 100);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.error = 'Failed to load order history.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  calculateStats() {
    this.totalOrders = this.orders.length;
    this.totalSpent = 0;
    this.totalItems = 0;
    
    for (const order of this.orders) {
      if (order.items) {
        for (const item of order.items) {
          this.totalSpent += (item.unitPrice * item.quantity);
          this.totalItems += item.quantity;
        }
      }
    }
  }

  private renderCharts(): void {
    if (this.orders.length === 0) return;

    const darkLayout = {
      paper_bgcolor: 'rgba(15,15,35,0)',
      plot_bgcolor: 'rgba(15,15,35,0)',
      font: { color: '#cbd5e1', family: 'Inter, sans-serif', size: 12 },
      margin: { t: 30, r: 20, b: 80, l: 50 },
      xaxis: { gridcolor: 'rgba(255,255,255,0.05)', zerolinecolor: 'rgba(255,255,255,0.1)' },
      yaxis: { gridcolor: 'rgba(255,255,255,0.05)', zerolinecolor: 'rgba(255,255,255,0.1)' },
    };

    // Spending Over Time (Line Chart)
    const timeEl = document.getElementById('chart-spending-time');
    if (timeEl) {
      // Group by Date (YYYY-MM-DD)
      const spendingByDate: { [key: string]: number } = {};
      this.orders.forEach(order => {
        const date = new Date(order.orderDate).toISOString().split('T')[0];
        let orderTotal = 0;
        if (order.items) {
          order.items.forEach((item: any) => orderTotal += (item.unitPrice * item.quantity));
        }
        if (!spendingByDate[date]) spendingByDate[date] = 0;
        spendingByDate[date] += orderTotal;
      });

      const dates = Object.keys(spendingByDate).sort();
      const amounts = dates.map(d => spendingByDate[d]);

      (Plotly as any).newPlot(timeEl, [{
        x: dates,
        y: amounts,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#818cf8', width: 3 },
        marker: { color: '#6366f1', size: 8 }
      }], { ...darkLayout, margin: { t: 30, r: 20, b: 40, l: 60 } }, { responsive: true, displayModeBar: false });
    }

    // Top Products Bought (Bar Chart)
    const productEl = document.getElementById('chart-spending-products');
    if (productEl) {
      const productCounts: { [key: string]: number } = {};
      this.orders.forEach(order => {
        if (order.items) {
          order.items.forEach((item: any) => {
            const name = item.productName || 'Unknown';
            const shortName = name.length > 20 ? name.substring(0, 20) + '…' : name;
            if (!productCounts[shortName]) productCounts[shortName] = 0;
            productCounts[shortName] += item.quantity;
          });
        }
      });

      const entries = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const names = entries.map(e => e[0]);
      const quantities = entries.map(e => e[1]);

      (Plotly as any).newPlot(productEl, [{
        x: names,
        y: quantities,
        type: 'bar',
        marker: {
          color: '#34d399',
          opacity: 0.85,
          line: { color: 'rgba(255,255,255,0.15)', width: 1 }
        }
      }], { ...darkLayout }, { responsive: true, displayModeBar: false });
    }
  }
}
