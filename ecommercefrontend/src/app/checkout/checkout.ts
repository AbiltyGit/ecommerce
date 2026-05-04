import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // FormsModule eklendi

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule eklendi
  template: `
    <div class="flex h-screen overflow-hidden w-full bg-slate-900/40 items-center justify-center">
      <div class="w-full max-w-md glass-card rounded-2xl p-8 border border-white/5 shadow-2xl animate-fade-in relative overflow-y-auto max-h-[90vh]">
        <!-- Header (Aynı kalıyor) -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white tracking-tight">Checkout</h2>
        </div>

        <div *ngIf="loading" class="text-center text-indigo-400 py-8 flex flex-col items-center">
           <div class="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
           Processing Order...
        </div>

        <div *ngIf="!loading && !orderSuccess">
          
          <div class="mb-4">
            <label class="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Shipping Address</label>
            <textarea [(ngModel)]="shippingAddress" rows="2" class="w-full glass-input px-4 py-3 rounded-xl text-white" placeholder="123 Main St, City"></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Billing Address</label>
            <textarea [(ngModel)]="billingAddress" rows="2" class="w-full glass-input px-4 py-3 rounded-xl text-white" placeholder="Same as shipping?"></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Payment Method</label>
            <select [(ngModel)]="paymentMethod" class="w-full glass-input px-4 py-3 rounded-xl text-white">
              <option value="CREDIT_CARD" class="text-black">Credit Card</option>
              <option value="PAYPAL" class="text-black">PayPal</option>
            </select>
          </div>
          
          <button (click)="placeOrder()" class="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all flex items-center justify-center">
            Confirm & Pay
          </button>
        </div>

        <div *ngIf="orderSuccess" class="text-center py-8">
          <h3 class="text-xl font-bold text-white mb-2">Order Confirmed!</h3>
          <button (click)="goToOrders()" class="w-full py-3 rounded-xl bg-slate-800 text-white transition-colors border border-white/5">
            View My Orders
          </button>
        </div>
      </div>
    </div>
  `
})
export class Checkout implements OnInit {
  userId: number = 0;
  loading: boolean = false;
  orderSuccess: boolean = false;
  
  shippingAddress: string = '';
  billingAddress: string = '';
  paymentMethod: string = 'CREDIT_CARD';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { this.userId = JSON.parse(userStr).id; } catch (e) {}
    }
    if (!this.userId) this.router.navigate(['/login']);
  }

  goToOrders() { this.router.navigate(['/order-history']); }

  placeOrder() {
    if (!this.shippingAddress || !this.billingAddress) {
      alert("Addresses are required!");
      return;
    }

    this.loading = true;
    this.http.get<any>(`/api/carts/user/${this.userId}`).subscribe({
      next: (cart) => {
        const orderItems = cart.items.map((ci: any) => ({
          productId: ci.product.id, quantity: ci.quantity
        }));

        const orderReq = {
          userId: this.userId,
          paymentMethod: this.paymentMethod,
          shippingAddress: this.shippingAddress,
          billingAddress: this.billingAddress,
          items: orderItems
        };

        this.http.post('/api/orders', orderReq).subscribe({
          next: () => {
            this.http.delete(`/api/carts/user/${this.userId}/clear`).subscribe({
              next: () => { this.loading = false; this.orderSuccess = true; },
              error: () => { this.loading = false; this.orderSuccess = true; }
            });
          },
          error: (err) => {
            alert('Failed to place order.');
            this.loading = false;
          }
        });
      }
    });
  }
}