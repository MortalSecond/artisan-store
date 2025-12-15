import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Painting } from '../shared/models/painting';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5051/api/Paintings';

  constructor() { }

  getAllPaintings(): Observable<Painting[]>{
    return this.http.get<Painting[]>(this.apiUrl);
  }

  uploadPainting(form: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}/upload`, form);
  }

  deletePainting(id:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updatePainting(id: number, form: FormData): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, form);
  }
}
