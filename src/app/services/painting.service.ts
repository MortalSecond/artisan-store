import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Painting } from '../shared/models/painting';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Paintings`;

  constructor() { }

  // Public endpoints
  getAllPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.apiUrl);
  }

  getPainting(id: number): Observable<Painting> {
    return this.http.get<Painting>(`${this.apiUrl}/${id}`);
  }

  // Admin endpoints
  uploadPainting(formData: FormData): Observable<Painting> {
    return this.http.post<Painting>(`${this.apiUrl}/upload`, formData);
  }

  updatePainting(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deletePainting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleAvailability(id: number): Observable<{ available: boolean }> {
    return this.http.patch<{ available: boolean }>(
      `${this.apiUrl}/${id}/availability`, 
      {}
    );
  }
}
