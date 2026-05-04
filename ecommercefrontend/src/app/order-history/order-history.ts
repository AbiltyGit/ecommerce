import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.html'
})
export class OrderHistory implements OnInit {
  orders: any[] = [];
  userId: number = 0;
  loading: boolean = true;
  showReviewModal: boolean = false;
  reviewingProductId: number | null = null;
  reviewRating: number = 5;
  reviewComment: string = '';
  submittingReview: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
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
        // Sort orders by newest first
        this.orders = data.sort((a, b) => b.id - a.id);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openReviewModal(productId: number) {
    this.reviewingProductId = productId;
    this.reviewRating = 5;
    this.reviewComment = '';
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.reviewingProductId = null;
  }

  submitReview() {
    if (!this.reviewingProductId || !this.reviewComment.trim()) {
      alert("Please enter a comment");
      return;
    }
    this.submittingReview = true;
    const req = {
      productId: this.reviewingProductId,
      userId: this.userId,
      rating: this.reviewRating,
      comment: this.reviewComment
    };

    this.http.post('/api/reviews', req).subscribe({
      next: () => {
        alert("Review submitted successfully!");
        this.submittingReview = false;
        this.closeReviewModal();
      },
      error: (err) => {
        console.error("Failed to submit review", err);
        alert("Failed to submit review. You may have already reviewed this product.");
        this.submittingReview = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  logout() {
    this.authService.logout();
  }
}
