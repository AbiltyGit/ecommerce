import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html'
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  loading = true;
  deletingId: number | null = null;

  // Filters
  searchQuery = '';
  selectedRole = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  readonly roleColors: Record<string, string> = {
    ADMIN: 'bg-red-500/10 text-red-400 border-red-500/20',
    CORPORATE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    INDIVIDUAL: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  onFilterChange() {
    this.currentPage = 0;
    this.fetchUsers();
  }

  fetchUsers(page: number = this.currentPage) {
    this.loading = true;
    this.currentPage = page;
    this.cdr.detectChanges();

    let url = `/api/users?page=${page}&size=${this.pageSize}`;
    if (this.searchQuery) url += `&query=${encodeURIComponent(this.searchQuery)}`;
    if (this.selectedRole && this.selectedRole !== 'ALL') url += `&role=${this.selectedRole}`;

    this.http.get<any>(url).subscribe({
      next: (res) => { 
        console.log('Users API Response:', res);
        
        // Handle both standard Page and VIA_DTO Page formats
        this.users = res.content || (Array.isArray(res) ? res : []); 
        
        this.totalPages = res.page?.totalPages ?? res.totalPages ?? (Array.isArray(res) ? 1 : 0);
        this.totalElements = res.page?.totalElements ?? res.totalElements ?? (Array.isArray(res) ? res.length : 0);
        
        this.loading = false; 
        this.cdr.detectChanges();
        // Scroll to top
        document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => { 
        console.error('Users API Error:', err); 
        this.loading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.fetchUsers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.fetchUsers(this.currentPage - 1);
    }
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
