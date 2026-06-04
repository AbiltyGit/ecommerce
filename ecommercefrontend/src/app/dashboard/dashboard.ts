import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Plotly from 'plotly.js-dist-min';
import { DashboardService, DashboardStats } from '../services/dashboard';
import { AuthService } from '../services/auth';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error: string | null = null;
  startDate: string = '';
  endDate: string = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.dashboardService.getStats(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.stats = data;
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.renderCharts(), 100);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.error = 'Failed to load dashboard data. Is the backend running?';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  updateFilters() {
    this.loadStats();
  }

  formatNumber(num: any): string {
    if (num === null || num === undefined) return '0';
    const n = Number(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  }

  logout() {
    this.authService.logout();
  }

  goToChat() {
    this.router.navigate(['/chat']);
  }

  private renderCharts(): void {
    if (!this.stats) return;

    const darkLayout = {
      paper_bgcolor: 'rgba(15,15,35,0)',
      plot_bgcolor: 'rgba(15,15,35,0)',
      font: { color: '#cbd5e1', family: 'Inter, sans-serif', size: 12 },
      margin: { t: 30, r: 20, b: 80, l: 50 },
      xaxis: { gridcolor: 'rgba(255,255,255,0.05)', zerolinecolor: 'rgba(255,255,255,0.1)' },
      yaxis: { gridcolor: 'rgba(255,255,255,0.05)', zerolinecolor: 'rgba(255,255,255,0.1)' },
    };

    // Chart 1: Top Products (Horizontal Bar)
    const topProductEl = document.getElementById('chart-top-products');
    if (topProductEl && this.stats.topProductsByReviews?.length) {
      const names = this.stats.topProductsByReviews.map(p => p.name.length > 25 ? p.name.substring(0, 25) + '…' : p.name);
      const counts = this.stats.topProductsByReviews.map(p => Number(p.review_count));
      (Plotly as any).newPlot(topProductEl, [{
        x: counts,
        y: names,
        type: 'bar',
        orientation: 'h',
        marker: {
          color: counts.map((_: any, i: number) => `hsl(${250 + i * 8}, 70%, ${65 - i * 2}%)`),
          line: { color: 'rgba(255,255,255,0.1)', width: 1 }
        }
      }], { ...darkLayout, margin: { t: 30, r: 20, b: 40, l: 220 } }, { responsive: true, displayModeBar: false });
    }

    // Chart 2: Rating Distribution (Donut)
    const ratingEl = document.getElementById('chart-rating-dist');
    if (ratingEl && this.stats.ratingDistribution?.length) {
      const labels = this.stats.ratingDistribution.map(r => `${r.rating} ⭐`);
      const values = this.stats.ratingDistribution.map(r => Number(r.count));
      (Plotly as any).newPlot(ratingEl, [{
        labels,
        values,
        type: 'pie',
        hole: 0.55,
        marker: { colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1'] },
        textinfo: 'label+percent',
        textfont: { color: '#cbd5e1' }
      }], { ...darkLayout, margin: { t: 30, r: 20, b: 20, l: 20 }, showlegend: false }, { responsive: true, displayModeBar: false });
    }

    // Chart 3: Top Categories (Vertical Bar)
    const catEl = document.getElementById('chart-top-categories');
    if (catEl && this.stats.topCategories?.length) {
      const cats = this.stats.topCategories.map(c => c.category);
      const counts2 = this.stats.topCategories.map(c => Number(c.product_count));
      (Plotly as any).newPlot(catEl, [{
        x: cats,
        y: counts2,
        type: 'bar',
        marker: {
          color: '#818cf8',
          opacity: 0.85,
          line: { color: 'rgba(255,255,255,0.15)', width: 1 }
        }
      }], { ...darkLayout }, { responsive: true, displayModeBar: false });
    }

    // Chart 4: Cross-Store Comparison (Grouped Bar)
    const storeEl = document.getElementById('chart-store-comparison');
    if (storeEl && this.stats.storeComparison?.length) {
      const stores = this.stats.storeComparison.map(s => s.store_name);
      const prodCounts = this.stats.storeComparison.map(s => Number(s.product_count));
      const ratings = this.stats.storeComparison.map(s => Number(s.avg_rating));

      (Plotly as any).newPlot(storeEl, [
        {
          x: stores,
          y: prodCounts,
          name: 'Products',
          type: 'bar',
          marker: { color: '#6366f1' }
        },
        {
          x: stores,
          y: ratings,
          name: 'Avg Rating',
          type: 'scatter',
          yaxis: 'y2',
          marker: { color: '#f59e0b' }
        }
      ], {
        ...darkLayout,
        barmode: 'group',
        yaxis2: {
          title: 'Rating',
          overlaying: 'y',
          side: 'right',
          range: [0, 5],
          showgrid: false
        },
        legend: { orientation: 'h', y: -0.2, font: { color: '#cbd5e1' } }
      }, { responsive: true, displayModeBar: false });
    }

    // Chart 5: Customer Segmentation (Pie/Donut for Membership Type)
    const segEl = document.getElementById('chart-customer-segmentation');
    if (segEl && this.stats.customerSegmentation?.length) {
      const labels = this.stats.customerSegmentation.map(s => s.membership_type);
      const values = this.stats.customerSegmentation.map(s => Number(s.user_count));

      (Plotly as any).newPlot(segEl, [{
        labels: labels,
        values: values,
        type: 'pie',
        hole: 0.4,
        marker: {
          colors: ['#6366f1', '#a855f7', '#ec4899', '#f97316']
        },
        textinfo: 'label+percent',
        insidetextorientation: 'radial'
      }], {
        ...darkLayout,
        showlegend: true,
        legend: { font: { color: '#cbd5e1' } }
      }, { responsive: true, displayModeBar: false });
    }
  }
}
