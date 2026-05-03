import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html'
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  loading = true;
  deletingId: number | null = null;

  readonly roleColors: Record<string, string> = {
    ADMIN: 'bg-red-500/10 text-red-400 border-red-500/20',
    CORPORATE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    INDIVIDUAL: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('/api/users').subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  deleteUser(user: any) {
    if (!confirm(`Are you sure you want to delete "${user.username}"? This cannot be undone.`)) return;
    this.deletingId = user.id;
    this.http.delete(`/api/users/${user.id}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.deletingId = null;
      },
      error: (err) => {
        alert('Failed to delete user. They may have associated orders or data.');
        this.deletingId = null;
      }
    });
  }

  getRoleClass(role: string): string {
    return this.roleColors[role] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  goBack() { this.router.navigate(['/admin/dashboard']); }
  logout() { this.authService.logout(); }
}
