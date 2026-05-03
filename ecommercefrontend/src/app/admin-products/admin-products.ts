import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-products-container">
      <h2>Manage Products</h2>
      
      <div class="add-product-form">
        <h3>Add New Product</h3>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>SKU:</label>
            <input type="text" [(ngModel)]="newProduct.sku" name="sku" required />
          </div>
          <div class="form-group">
            <label>Name:</label>
            <input type="text" [(ngModel)]="newProduct.name" name="name" required />
          </div>
          <div class="form-group">
            <label>Description:</label>
            <textarea [(ngModel)]="newProduct.description" name="description"></textarea>
          </div>
          <div class="form-group">
            <label>Price:</label>
            <input type="number" [(ngModel)]="newProduct.price" name="price" required />
          </div>
          <div class="form-group">
            <label>Stock Quantity:</label>
            <input type="number" [(ngModel)]="newProduct.stockQuantity" name="stockQuantity" required />
          </div>
          <button type="submit">Create Product</button>
        </form>
      </div>

      <div class="product-list">
        <h3>Existing Products</h3>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.sku }}</td>
              <td>{{ product.name }}</td>
              <td>\${{ product.price }}</td>
              <td [class.low-stock]="product.stockQuantity < 10">{{ product.stockQuantity }}</td>
              <td>
                <button class="delete-btn" (click)="deleteProduct(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-products-container { padding: 20px; font-family: Arial, sans-serif; }
    .add-product-form { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; max-width: 600px; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    button { background: #27ae60; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #2ecc71; }
    .delete-btn { background: #e74c3c; padding: 5px 10px; font-size: 12px; }
    .delete-btn:hover { background: #c0392b; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f2f2f2; }
    .low-stock { color: #e74c3c; font-weight: bold; }
  `]
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  newProduct: any = {
    sku: '', name: '', description: '', price: 0, stockQuantity: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('/api/products').subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    this.http.post('/api/products', this.newProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.newProduct = { sku: '', name: '', description: '', price: 0, stockQuantity: 0 };
        alert('Product created successfully!');
      },
      error: (err) => alert('Failed to create product')
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(\`/api/products/\${id}\`).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Failed to delete product')
      });
    }
  }
}
