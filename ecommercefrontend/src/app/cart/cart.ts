import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h2>Shopping Cart</h2>
      <div *ngIf="cart?.items?.length === 0">Your cart is empty.</div>
      <div *ngFor="let item of cart?.items" class="cart-item">
        <span>Product ID: {{ item.product.id }}</span>
        <span>Quantity: {{ item.quantity }}</span>
        <button (click)="removeItem(item.id)">Remove</button>
      </div>
      <button *ngIf="cart?.items?.length > 0" (click)="checkout()">Proceed to Checkout</button>
    </div>
  `,
  styles: [`
    .cart-container { padding: 20px; }
    .cart-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; border: 1px solid #eee; }
    button { background: #e74c3c; color: white; border: none; padding: 8px 16px; cursor: pointer; }
  `]
})
export class CartComponent {
  cart: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.http.get<any>('/api/carts/user/1').subscribe(data => {
      this.cart = data;
    });
  }

  removeItem(itemId: number) {
    this.http.delete(`/api/carts/user/1/remove/${itemId}`).subscribe(() => this.loadCart());
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
