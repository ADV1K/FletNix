import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav class="bg-white dark:bg-gray-800 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a routerLink="/" class="text-2xl font-bold text-red-600 dark:text-red-400">
                FletNix
              </a>
            </div>
            <div class="flex items-center space-x-4">
              <a *ngIf="!isAuthenticated" routerLink="/login" 
                 class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
              <a *ngIf="!isAuthenticated" routerLink="/register" 
                 class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Register
              </a>
              <button *ngIf="isAuthenticated" (click)="logout()" 
                      class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  isAuthenticated = false;

  constructor(private router: Router) {
    // Check authentication status
    this.checkAuth();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuth();
    });
  }

  checkAuth() {
    // Check localStorage for token (cookie is httpOnly and can't be read by JS)
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    this.isAuthenticated = !!token;
  }

  logout() {
    // Remove token from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    // Also clear cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.isAuthenticated = false;
    window.location.href = '/login';
  }
}

