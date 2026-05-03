import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-screen overflow-hidden w-full bg-slate-900/40 items-center justify-center">
      <div class="w-full max-w-md glass-card rounded-2xl p-8 border border-white/5 shadow-2xl animate-fade-in relative">
        <button (click)="goBack()" class="absolute top-4 left-4 text-slate-400 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Checkout</h2>
          <p class="text-sm text-slate-400 mt-2">Complete your secure payment</p>
        </div>

        <div *ngIf="loading" class="text-center text-indigo-400 py-8 flex flex-col items-center">
           <div class="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
           Processing Order...
        </div>

        <div *ngIf="!loading && !orderSuccess">
          <div class="mb-6">
            <label class="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Payment Method</label>
            <div class="relative">
              <select #payment class="w-full glass-input px-4 py-3 rounded-xl text-white appearance-none">
                <option value="CREDIT_CARD" class="text-black">Credit Card</option>
                <option value="PAYPAL" class="text-black">PayPal</option>
                <option value="STRIPE" class="text-black">Stripe</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
          
          <button (click)="placeOrder(payment.value)" class="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
            Confirm & Pay
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        <div *ngIf="orderSuccess" class="text-center py-8">
          <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Order Confirmed!</h3>
          <p class="text-sm text-slate-400 mb-6">Your items will be shipped soon.</p>
          <button (click)="goToOrders()" class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-white/5">
            View My Orders
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class Checkout implements OnInit {
  userId: number = 0;
  loading: boolean = false;
  orderSuccess: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id;
      } catch (e) {}
    }
    
    if (!this.userId) {
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  goToOrders() {
    this.router.navigate(['/order-history']);
  }

  placeOrder(paymentMethod: string) {
    this.loading = true;
    
    // 1. Fetch Cart
    this.http.get<any>(`/api/carts/user/${this.userId}`).subscribe({
      next: (cart) => {
        if (!cart.items || cart.items.length === 0) {
          alert('Cart is empty!');
          this.loading = false;
          return;
        }

        // 2. Build Order Request
        const orderItems = cart.items.map((ci: any) => ({
          productId: ci.product.id,
          quantity: ci.quantity
        }));

        const orderReq = {
          userId: this.userId,
          paymentMethod: paymentMethod,
          items: orderItems
        };

        // 3. Submit Order
        this.http.post('/api/orders', orderReq).subscribe({
          next: () => {
            // 4. Clear Cart
            this.http.delete(`/api/carts/user/${this.userId}/clear`).subscribe({
              next: () => {
                this.loading = false;
                this.orderSuccess = true;
              },
              error: () => {
                this.loading = false;
                this.orderSuccess = true; // Still show success for order
              }
            });
          },
          error: (err) => {
            alert('Failed to place order: ' + (err.error?.message || 'Unknown error'));
            this.loading = false;
          }
        });
      },
      error: (err) => {
        alert('Failed to fetch cart.');
        this.loading = false;
      }
    });
  }
}
