import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../services/auth';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  route: string;
  iconKey: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './shell.html'
})
export class Shell implements OnInit {
  userRole = '';
  username = '';
  userId = 0;
  currentRoute = '';
  navItems: NavItem[] = [];

  private readonly svgPaths: Record<string, string> = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    products:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    cart:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    orders:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
    history:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    chat:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    users:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    stores:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    star:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    categories: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
    admin:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    profile:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.userId = user.id;
    }
    this.buildNav();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute = e.urlAfterRedirects;
        this.cdr.detectChanges();
      });
    this.currentRoute = this.router.url;
    this.cdr.detectChanges();
  }

  buildNav() {
    switch (this.userRole) {
      case 'ADMIN':
        this.navItems = [
          { label: 'Admin Hub',           route: '/admin/dashboard',  iconKey: 'admin'     },
          { label: 'Analytics Center',    route: '/dashboard',        iconKey: 'dashboard' },
          { label: 'AI Data Explorer',    route: '/chat',             iconKey: 'chat'      },
          { label: 'Order Management',    route: '/admin/orders',     iconKey: 'orders'    },
          { label: 'Product Catalog',     route: '/admin/products',   iconKey: 'products'  },
          { label: 'Category Settings',   route: '/admin/categories', iconKey: 'categories' },
          { label: 'Review Moderation',   route: '/admin/reviews',    iconKey: 'star'      },
          { label: 'User Management',     route: '/admin/users',      iconKey: 'users'     },
          { label: 'Store Approvals',     route: '/admin/stores',     iconKey: 'stores'    },
          { label: 'System Audit Logs',   route: '/admin/audit',      iconKey: 'history'   },
          { label: 'My Profile',          route: '/profile',          iconKey: 'profile'   },
        ];
        break;
      case 'CORPORATE':
        this.navItems = [
          { label: 'Store Dashboard',     route: '/admin/dashboard',  iconKey: 'dashboard' },
          { label: 'AI Data Explorer',    route: '/chat',             iconKey: 'chat'      },
          { label: 'Manage Orders',       route: '/admin/orders',     iconKey: 'orders'    },
          { label: 'Manage Products',     route: '/admin/products',   iconKey: 'products'  },
          { label: 'Manage Reviews',      route: '/admin/reviews',    iconKey: 'star'      },
          { label: 'My Profile',          route: '/profile',          iconKey: 'profile'   },
        ];
        break;
      default: // INDIVIDUAL
        this.navItems = [
          { label: 'Browse Products',     route: '/products',         iconKey: 'products'  },
          { label: 'My Analytics',        route: '/my-dashboard',     iconKey: 'dashboard' },
          { label: 'My Cart',             route: '/cart',             iconKey: 'cart'      },
          { label: 'My Orders',           route: '/order-history',    iconKey: 'history'   },
          { label: 'AI Assistant',        route: '/chat',             iconKey: 'chat'      },
          { label: 'My Profile',          route: '/profile',          iconKey: 'profile'   },
        ];
    }
  }

  icon(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgPaths[key] || '');
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  getRoleLabel(): string {
    const map: Record<string, string> = { ADMIN: 'Platform Admin', CORPORATE: 'Store Manager' };
    return map[this.userRole] || 'Customer';
  }

  getRoleBadgeClass(): string {
    const map: Record<string, string> = {
      ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
      CORPORATE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return map[this.userRole] || 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  }

  logout() { this.authService.logout(); }
}
