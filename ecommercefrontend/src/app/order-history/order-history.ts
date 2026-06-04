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
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  hasMore: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchOrders();
  }

  fetchOrders(append: boolean = false) {
    this.loading = true;
    this.http.get<any>(`/api/orders/user/${this.userId}?page=${this.currentPage}&size=${this.pageSize}&sort=orderDate,desc`).subscribe({
      next: (data) => {
        const newOrders = data.content || [];
        if (append) {
          this.orders = [...this.orders, ...newOrders];
        } else {
          this.orders = newOrders;
        }
        this.totalPages = data.page?.totalPages ?? data.totalPages ?? 0;
        this.hasMore = data.last !== undefined ? !data.last : (data.page ? data.page.number < data.page.totalPages - 1 : false);
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

  loadMore() {
    if (this.hasMore) {
      this.currentPage++;
      this.fetchOrders(true);
    }
  }

  exportToCSV() {
    if (this.orders.length === 0) return;

    const headers = ['Order ID', 'Date', 'Status', 'Payment Method', 'Tracking Number', 'Total Amount'];
    const rows = this.orders.map(o => [
      o.id,
      o.orderDate,
      o.status,
      o.paymentMethod,
      o.trackingNumber || 'N/A',
      o.totalAmount || '0'
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `order_history_${this.userId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
