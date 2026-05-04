import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  cart: any = null;
  loading = true;
  userId = 0;
  removingId: number | null = null;

constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef // EKLENDİ
  ) {}
  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { this.userId = JSON.parse(userStr).id; } catch (e) {}
    }
    if (!this.userId) { this.router.navigate(['/login']); return; }
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.http.get<any>(`/api/carts/user/${this.userId}`).subscribe({
      next: (data) => { this.cart = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.cart = null; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  removeItem(itemId: number) {
    this.removingId = itemId;
    this.http.delete(`/api/carts/user/${this.userId}/remove/${itemId}`).subscribe({
      next: () => { this.removingId = null; this.loadCart(); this.cdr.detectChanges(); },
      error: () => { this.removingId = null; this.cdr.detectChanges(); }
    });
  }

  get totalPrice(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity, 0);
  }

  checkout() { this.router.navigate(['/checkout']); }
}
