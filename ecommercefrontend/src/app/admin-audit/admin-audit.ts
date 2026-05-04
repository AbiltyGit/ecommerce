import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-audit.html'
})
export class AdminAudit implements OnInit {
  logs: any[] = [];
  loading = true;
  userRole = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role;
      } catch (e) {}
    }

    if (this.userRole !== 'ADMIN') {
      this.router.navigate(['/products']);
      return;
    }

    this.fetchLogs();
  }

  fetchLogs() {
    this.http.get<any[]>('/api/audit').subscribe({
      next: (data) => {
        // Sort newest first
        this.logs = data.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load audit logs', err);
        this.loading = false;
      }
    });
  }
}
