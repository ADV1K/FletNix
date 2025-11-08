import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ShowService, Show } from '../../services/show.service';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Netflix Titles</h1>

      <!-- Search and Filters -->
      <div class="mb-6 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            placeholder="Search by title or cast..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            [(ngModel)]="selectedType"
            (ngModelChange)="loadShows()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Types</option>
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
          <select
            [(ngModel)]="selectedGenre"
            (ngModelChange)="loadShows()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Genres</option>
            <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading shows...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Shows Grid -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          *ngFor="let show of shows"
          (click)="viewShow(show)"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div class="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span class="text-gray-400 text-4xl">{{ show.type === 'Movie' ? '🎬' : '📺' }}</span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ show.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ show.type }} • {{ show.release_year }}
            </p>
            <p *ngIf="show.rating" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Rating: {{ show.rating }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && shows.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400 text-lg">No shows found</p>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && !error && pagination && pagination.pages > 1" class="mt-8 flex justify-center items-center space-x-2">
        <button
          (click)="goToPage(pagination.page - 1)"
          [disabled]="pagination.page === 1"
          class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-gray-700 dark:text-gray-300">
          Page {{ pagination.page }} of {{ pagination.pages }}
        </span>
        <button
          (click)="goToPage(pagination.page + 1)"
          [disabled]="pagination.page === pagination.pages"
          class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class ShowListComponent implements OnInit {
  shows: Show[] = [];
  loading = false;
  error = '';
  searchQuery = '';
  selectedType = '';
  selectedGenre = '';
  genres: string[] = [];
  pagination: { page: number; limit: number; total: number; pages: number } | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private showService: ShowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadShows();
    this.loadGenres();
  }

  loadShows(page: number = 1) {
    this.loading = true;
    this.error = '';

    this.showService.getShows(page, this.searchQuery || undefined, this.selectedType || undefined, this.selectedGenre || undefined)
      .subscribe({
        next: (response) => {
          this.shows = response.shows;
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Failed to load shows';
          this.loading = false;
        }
      });
  }

  loadGenres() {
    // Load all shows to extract unique genres
    this.showService.getShows(1, undefined, undefined, undefined).subscribe({
      next: (response) => {
        const genreSet = new Set<string>();
        response.shows.forEach(show => {
          if (show.listed_in) {
            show.listed_in.forEach(genre => genreSet.add(genre));
          }
        });
        this.genres = Array.from(genreSet).sort();
      }
    });
  }

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadShows(1);
    }, 500);
  }

  goToPage(page: number) {
    if (page >= 1 && this.pagination && page <= this.pagination.pages) {
      this.loadShows(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  viewShow(show: Show) {
    const id = show._id || show.show_id;
    this.router.navigate(['/shows', id]);
  }
}

