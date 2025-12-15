import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactForm } from '../shared/models/contact-form';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:5051/api"

  constructor() { }

  getAllInquiries(): Observable<ContactForm[]>{
    return this.http.get<ContactForm[]>(`${this.apiUrl}/Contact`)
  }

  getAllCommissions(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/Commission`)
  }
}
