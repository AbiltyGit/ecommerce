import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html'
})
export class Products implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  
  searchQuery: string = '';
  selectedCategoryId: number | '' = '';
  sortBy: string = 'newest';
  
  userId: number = 0;
  
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 16;
  totalElements: number = 0;

  private categoryVisuals: Record<string, { gradient: string, icon: string }> = {
    Beauty: { gradient: 'from-pink-500 to-rose-500', icon: '✨' },
    Grocery: { gradient: 'from-emerald-500 to-green-600', icon: '🍎' },
    Electronics: { gradient: 'from-blue-500 to-indigo-600', icon: '🔌' },
    Fashion: { gradient: 'from-purple-500 to-indigo-500', icon: '👗' },
    Books: { gradient: 'from-amber-500 to-orange-600', icon: '📚' },
    Default: { gradient: 'from-slate-500 to-slate-700', icon: '📦' }
  };

  getVisuals(catName: string) {
    return this.categoryVisuals[catName] || this.categoryVisuals['Default'];
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.fetchCategories();
    this.fetchProducts();
  }

  fetchCategories() {
    this.http.get<any[]>('/api/categories').subscribe({
      next: (data) => { this.categories = data; this.cdr.detectChanges(); },
      error: (err) => { console.error('Failed to load categories', err); this.cdr.detectChanges(); }
    });
  }

  fetchProducts() {
    let url = `/api/products?page=${this.currentPage}&size=${this.pageSize}&sortBy=${this.sortBy}`;
    if (this.searchQuery.trim() !== '') {
      url += `&search=${encodeURIComponent(this.searchQuery.trim())}`;
    }
    if (this.selectedCategoryId !== '') {
      url += `&categoryId=${this.selectedCategoryId}`;
    }

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.products = data.content || (Array.isArray(data) ? data : []);
        this.totalPages = data.page?.totalPages ?? data.totalPages ?? (Array.isArray(data) ? 1 : 0);
        this.totalElements = data.page?.totalElements ?? data.totalElements ?? (Array.isArray(data) ? this.products.length : 0);
        this.cdr.detectChanges();
        // Scroll to top of the container so user sees the new products
        document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => { console.error('Failed to load products', err); this.cdr.detectChanges(); }
    });
  }

  applyFilters() {
    this.currentPage = 0;
    this.fetchProducts();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  addToCart(productId: number) {
    if (!this.userId) {
      alert("Please log in to add items to cart.");
      return;
    }
    
    this.http.post(`/api/carts/user/${this.userId}/add?productId=${productId}&quantity=1`, {}).subscribe({
      next: () => {
        alert("Product added to cart successfully!");
      },
      error: (err) => {
        alert("Failed to add product to cart.");
      }
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToOrders() {
    this.router.navigate(['/order-history']);
  }

  logout() {
    this.authService.logout();
  }
}
