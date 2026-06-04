import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-stores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stores.html'
})
export class AdminStores implements OnInit {
  stores: any[] = [];
  loading = true;
  togglingId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchStores();
  }

  fetchStores() {
    this.http.get<any[]>('/api/stores').subscribe({
      next: (data) => { 
        this.stores = data; 
        this.loading = false; 
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error(err); 
        this.loading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  toggleStore(store: any) {
    this.togglingId = store.id;
    this.cdr.detectChanges();
    this.http.patch(`/api/stores/${store.id}/toggle`, {}).subscribe({
      next: (updated: any) => {
        const idx = this.stores.findIndex(s => s.id === store.id);
        if (idx !== -1) this.stores[idx].isOpen = updated.isOpen;
        this.togglingId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Failed to toggle store status.');
        this.togglingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() { this.router.navigate(['/admin/dashboard']); }
  logout() { this.authService.logout(); }
}
