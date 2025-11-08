import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShowService, Show } from '../../services/show.service';

@Component({
  selector: 'app-show-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        (click)="goBack()"
        class="mb-6 text-red-600 hover:text-red-700 font-medium"
      >
        ← Back to Shows
      </button>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading show details...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Show Details -->
      <div *ngIf="!loading && !error && show" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center h-64 md:h-auto">
            <span class="text-gray-400 text-8xl">{{ show.type === 'Movie' ? '🎬' : '📺' }}</span>
          </div>
          <div class="md:w-2/3 p-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ show.title }}</h1>
            
            <div class="space-y-4">
              <div>
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Type:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.type }}</span>
              </div>
              
              <div *ngIf="show.release_year">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Release Year:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.release_year }}</span>
              </div>
              
              <div *ngIf="show.rating">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Rating:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.rating }}</span>
              </div>
              
              <div *ngIf="show.duration">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Duration:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.duration }}</span>
              </div>
              
              <div *ngIf="show.director">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Director:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.director }}</span>
              </div>
              
              <div *ngIf="show.cast && show.cast.length > 0">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Cast:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.cast.join(', ') }}</span>
              </div>
              
              <div *ngIf="show.country">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Country:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.country }}</span>
              </div>
              
              <div *ngIf="show.date_added">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Date Added:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ show.date_added }}</span>
              </div>
              
              <div *ngIf="show.listed_in && show.listed_in.length > 0">
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Genres:</span>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    *ngFor="let genre of show.listed_in"
                    class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm"
                  >
                    {{ genre }}
                  </span>
                </div>
              </div>
              
              <div *ngIf="show.description" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
                <p class="text-gray-700 dark:text-gray-300">{{ show.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div *ngIf="!loading && !error && recommendations.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommendations</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            *ngFor="let rec of recommendations"
            (click)="viewShow(rec)"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span class="text-gray-400 text-4xl">{{ rec.type === 'Movie' ? '🎬' : '📺' }}</span>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ rec.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ rec.type }} • {{ rec.release_year }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ShowDetailComponent implements OnInit {
  show: Show | null = null;
  recommendations: Show[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadShow(id);
    }
  }

  loadShow(id: string) {
    this.loading = true;
    this.error = '';

    this.showService.getShow(id).subscribe({
      next: (show) => {
        this.show = show;
        this.loading = false;
        this.loadRecommendations(id);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load show';
        this.loading = false;
      }
    });
  }

  loadRecommendations(id: string) {
    this.showService.getRecommendations(id).subscribe({
      next: (response) => {
        this.recommendations = response.recommendations;
      },
      error: (err) => {
        console.error('Failed to load recommendations:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/shows']);
  }

  viewShow(show: Show) {
    const id = show._id || show.show_id;
    this.router.navigate(['/shows', id]);
    this.loadShow(id);
  }
}

