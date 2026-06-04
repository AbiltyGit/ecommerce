import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.html'
})
export class AdminReviews implements OnInit {
  reviews: any[] = [];
  loading: boolean = true;
  responseInputs: { [key: number]: string } = {};
  
  userRole = '';
  userId = 0;

  // Pagination
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    this.fetchReviews();
  }

  fetchReviews(page: number = 0) {
    this.loading = true;
    this.currentPage = page;
    this.cdr.detectChanges();

    let endpoint = this.userRole === 'CORPORATE' 
      ? `/api/reviews/corporate/${this.userId}`
      : '/api/reviews';

    this.http.get<any>(endpoint, {
      params: {
        page: page.toString(),
        size: this.pageSize.toString(),
        sort: 'createdAt,desc'
      }
    }).subscribe({
      next: (data) => {
        console.log('Reviews API Response:', data);
        if (data && data.content) {
          this.reviews = data.content;
          this.totalPages = data.page?.totalPages ?? data.totalPages ?? 1;
          this.totalElements = data.page?.totalElements ?? data.totalElements ?? data.content.length;
        } else if (Array.isArray(data)) {
          this.reviews = data;
          this.totalPages = 1;
          this.totalElements = data.length;
        } else {
          this.reviews = [];
          this.totalPages = 1;
          this.totalElements = 0;
        }
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Processed Reviews for UI:', this.reviews);
      },
      error: (err) => {
        console.error('Failed to fetch reviews', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.fetchReviews(page);
    }
  }

  updateStatus(id: number, status: string) {
    this.http.patch(`/api/reviews/${id}/status?status=${status}`, {}).subscribe({
      next: () => {
        const review = this.reviews.find(r => r.id === id);
        if (review) review.status = status;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to update status');
      }
    });
  }

  submitResponse(id: number) {
    const response = this.responseInputs[id];
    if (!response || !response.trim()) return;

    this.http.post(`/api/reviews/${id}/respond`, response).subscribe({
      next: (updatedReview: any) => {
        const idx = this.reviews.findIndex(r => r.id === id);
        if (idx !== -1) {
          this.reviews[idx] = updatedReview;
          this.responseInputs[id] = '';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to submit response', err);
        alert('Failed to submit response');
      }
    });
  }
}
