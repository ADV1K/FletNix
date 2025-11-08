import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Show {
  _id?: string;
  show_id: string;
  type: 'Movie' | 'TV Show';
  title: string;
  director?: string;
  cast?: string[];
  country?: string;
  date_added?: string;
  release_year: number;
  rating?: string;
  duration?: string;
  listed_in?: string[];
  description?: string;
}

export interface ShowsResponse {
  shows: Show[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RecommendationsResponse {
  recommendations: Show[];
}

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getShows(page: number = 1, search?: string, type?: string, genre?: string): Observable<ShowsResponse> {
    let params = new HttpParams()
      .set('page', page.toString());

    if (search) {
      params = params.set('q', search);
    }
    if (type) {
      params = params.set('type', type);
    }
    if (genre) {
      params = params.set('genre', genre);
    }

    return this.http.get<ShowsResponse>(`${this.apiUrl}/shows`, { params });
  }

  getShow(id: string): Observable<Show> {
    return this.http.get<Show>(`${this.apiUrl}/shows/${id}`);
  }

  getRecommendations(id: string): Observable<RecommendationsResponse> {
    return this.http.get<RecommendationsResponse>(`${this.apiUrl}/shows/${id}/recommendations`);
  }
}

