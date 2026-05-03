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
  filteredProducts: any[] = [];
  categories: any[] = [];
  
  searchQuery: string = '';
  selectedCategoryId: number | '' = '';
  sortBy: string = 'newest';
  
  userId: number = 0;

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
    this.http.get<any[]>('/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  applyFilters() {
    let result = [...this.products];

    // Filter by Category
    if (this.selectedCategoryId !== '') {
      result = result.filter(p => p.category && p.category.id == this.selectedCategoryId);
    }

    // Filter by Search Query
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
    }

    this.filteredProducts = result;
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
