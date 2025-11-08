import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your FletNix account
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                [(ngModel)]="email"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                [(ngModel)]="password"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min="0"
                max="150"
                [(ngModel)]="age"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Your age"
              />
            </div>
          </div>

          <div *ngIf="error" class="text-red-600 text-sm text-center">{{ error }}</div>

          <div>
            <button
              type="submit"
              [disabled]="loading || !registerForm.valid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!loading">Register</span>
              <span *ngIf="loading">Registering...</span>
            </button>
          </div>

          <div class="text-center">
            <a routerLink="/login" class="text-sm text-red-600 hover:text-red-500">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  email = '';
  password = '';
  age: number | null = null;
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password || this.age === null) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.age < 0 || this.age > 150) {
      this.error = 'Please enter a valid age';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password, this.age).subscribe({
      next: () => {
        this.router.navigate(['/shows']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Registration failed';
        this.loading = false;
      }
    });
  }
}

