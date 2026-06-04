import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 h-full bg-slate-900/40 overflow-y-auto animate-fade-in">
      <h2 class="text-2xl font-bold text-white mb-6">Category Management</h2>
      
      <div class="glass-card p-6 rounded-2xl border border-white/5 mb-8 max-w-xl">
        <h3 class="text-lg text-white mb-4">Add New Category</h3>
        <div class="flex gap-4">
          <input type="text" [(ngModel)]="newCategoryName" class="glass-input flex-1 px-4 py-2 rounded-xl text-white" placeholder="e.g. Electronics">
          <button (click)="addCategory()" class="bg-indigo-500 px-6 py-2 rounded-xl text-white font-bold hover:bg-indigo-600 transition-all">Add</button>
        </div>
      </div>

      <div class="glass-card rounded-2xl border border-white/5 overflow-hidden max-w-xl">
        <table class="w-full text-left text-white">
          <thead class="bg-slate-800/30">
            <tr><th class="p-4">ID</th><th class="p-4">Category Name</th></tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr *ngFor="let cat of categories" class="hover:bg-white/5 transition-colors">
              <td class="p-4 text-slate-400 font-mono text-sm">#{{ cat.id }}</td><td class="p-4">{{ cat.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminCategories implements OnInit {
  categories: any[] = [];
  newCategoryName: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.fetchCategories(); }

  fetchCategories() {
    this.http.get<any[]>('/api/categories').subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
  }

  addCategory() {
    if(!this.newCategoryName.trim()) return;
    this.http.post('/api/categories', { name: this.newCategoryName }).subscribe(() => {
      this.newCategoryName = '';
      this.fetchCategories();
      this.cdr.detectChanges();
    });
  }
}