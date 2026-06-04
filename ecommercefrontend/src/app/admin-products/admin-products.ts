import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html'
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  showAddModal = false;
  newProduct: any = {
    sku: '', name: '', description: '', price: 0, stockQuantity: 0, storeId: null, categoryId: null
  };
  
  userRole = '';
  userId = 0;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>('/api/categories').subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts(page: number = this.currentPage) {
    this.currentPage = page;
    let endpoint = this.userRole === 'CORPORATE' 
      ? `/api/products/corporate/${this.userId}`
      : `/api/products?page=${page}&size=${this.pageSize}`;

    this.http.get<any>(endpoint).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.products = data;
          this.totalPages = 1;
          this.totalElements = data.length;
        } else {
          this.products = data.content || [];
          this.totalPages = data.page?.totalPages ?? data.totalPages ?? 0;
          this.totalElements = data.page?.totalElements ?? data.totalElements ?? 0;
        }
        this.cdr.detectChanges();
        // Scroll to top
        document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  openAddModal() {
    this.showAddModal = true;
    this.newProduct = { 
      sku: '', name: '', description: '', price: 0, stockQuantity: 0, 
      storeId: null, 
      categoryId: this.categories.length > 0 ? this.categories[0].id : null 
    };
    
    if (this.userRole === 'CORPORATE') {
      // Find the store owned by this corporate user
      this.http.get<any[]>('/api/stores').subscribe({
        next: (stores) => {
          const myStore = stores.find(s => s.corporateUserId === this.userId);
          if (myStore) {
            this.newProduct.storeId = myStore.id;
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onSubmit() {
    this.http.post('/api/products', this.newProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.closeAddModal();
      },
      error: (err) => alert('Failed to create product')
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`/api/products/${id}`).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Failed to delete product')
      });
    }
  }
}
