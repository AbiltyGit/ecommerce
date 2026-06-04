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
  storeComparison: { store_name: string; product_count: number; avg_rating: number }[];
  customerSegmentation: { membership_type: string; user_count: number; avg_satisfaction: number }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API_URL = '/api/dashboard/stats';

  constructor(private http: HttpClient) {}

  getStats(startDate?: string, endDate?: string): Observable<DashboardStats> {
    let url = this.API_URL;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<DashboardStats>(url);
  }
}
