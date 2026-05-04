import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  userId: number = 0;
  loading: boolean = true;
  saving: boolean = false;
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>(`/api/profiles/user/${this.userId}`).subscribe({
      next: (data) => {
        this.profile = data || {};
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile() {
    this.saving = true;
    this.http.put<any>(`/api/profiles/user/${this.userId}`, this.profile).subscribe({
      next: (data) => {
        this.profile = data;
        this.saving = false;
        this.successMessage = 'Profile updated successfully!';
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error saving profile', err);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}