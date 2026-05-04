import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalProducts: number;
  totalReviews: number;
  totalUsers: number;
  averageRating: number;
  topProductsByReviews: { name: string; review_count: number }[];
  ratingDistribution: { rating: number; count: number }[];
  topCategories: { category: string; product_count: number }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API_URL = '/api/dashboard/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.API_URL);
  }
}
