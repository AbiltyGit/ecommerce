import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      <div class="form-group">
        <label>Payment Method</label>
        <select #payment>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="PAYPAL">PayPal</option>
        </select>
      </div>
      <button (click)="placeOrder(payment.value)">Place Order</button>
    </div>
  `,
  styles: [`
    .checkout-container { padding: 20px; max-width: 500px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    select { width: 100%; padding: 8px; }
    button { background: #2ecc71; color: white; padding: 10px 20px; border: none; cursor: pointer; width: 100%; }
  `]
})
export class Checkout {
  constructor(private http: HttpClient) {}

  placeOrder(paymentMethod: string) {
    const orderReq = {
      userId: 1,
      paymentMethod: paymentMethod,
      items: [] // usually you'd transfer cart items here, simplified for MVP
    };
    this.http.post('/api/orders', orderReq).subscribe(res => {
      alert('Order placed successfully!');
    });
  }
}
