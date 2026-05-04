import { Component, OnInit } from '@angular/core';
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
  pageSize: number = 12;
  totalElements: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    // Get user id from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id;
      } catch (e) {}
    }

    this.fetchCategories();
    this.fetchProducts();
  }

  fetchCategories() {
    this.http.get<any[]>('/api/categories').subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
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
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      },
      error: (err) => console.error('Failed to load products', err)
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
