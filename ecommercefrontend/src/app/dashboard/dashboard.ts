import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Plotly from 'plotly.js-dist-min';
import { DashboardService, DashboardStats } from '../services/dashboard';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
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
      const counts = this.stats.topProductsByReviews.map(p => p.review_count);
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
      const values = this.stats.ratingDistribution.map(r => r.count);
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
      const counts2 = this.stats.topCategories.map(c => c.product_count);
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
  }
}
