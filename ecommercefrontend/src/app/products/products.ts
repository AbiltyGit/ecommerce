import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="products-container">
      <h2>Product Catalog</h2>
      <div class="product-grid">
        <div class="product-card" *ngFor="let product of products">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p class="price">\${{ product.price }}</p>
          <button (click)="addToCart(product.id)">Add to Cart</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-container { padding: 20px; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .product-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    .price { font-weight: bold; color: #2c3e50; }
    button { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    button:hover { background: #2980b9; }
  `]
})
export class Products {
  products: any[] = [];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.http.get<any[]>('/api/products').subscribe(data => {
      this.products = data;
    });
  }

  addToCart(productId: number) {
    this.http.post(`/api/carts/user/1/add?productId=${productId}&quantity=1`, {}).subscribe();
  }
}
