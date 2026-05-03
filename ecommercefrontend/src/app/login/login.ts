import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role;

        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'CORPORATE') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        this.error = 'Invalid credentials or connection error.';
        this.loading = false;
      }
    });
  }
}
