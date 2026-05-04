import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html'
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  showAddModal = false;
  newProduct: any = {
    sku: '', name: '', description: '', price: 0, stockQuantity: 0, storeId: null
  };
  
  userRole = '';
  userId = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role;
        this.userId = user.id;
      } catch (e) {}
    }
    this.loadProducts();
  }

  loadProducts() {
    if (this.userRole === 'CORPORATE') {
      this.http.get<any[]>(`/api/products/corporate/${this.userId}`).subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error(err)
      });
    } else {
      this.http.get<any[]>('/api/products').subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error(err)
      });
    }
  }

  openAddModal() {
    this.showAddModal = true;
    this.newProduct = { sku: '', name: '', description: '', price: 0, stockQuantity: 0, storeId: null };
    
    // If corporate user, we need to fetch their store ID or backend should handle it.
    // For now, if we don't have storeId, we can set a dummy or rely on backend to assign it?
    // Wait, let's fetch their store ID first if they are corporate.
    if (this.userRole === 'CORPORATE') {
      this.http.get<any[]>(`/api/stores/corporate/${this.userId}`).subscribe({
        next: (stores) => {
          if (stores && stores.length > 0) {
            this.newProduct.storeId = stores[0].id;
          }
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
