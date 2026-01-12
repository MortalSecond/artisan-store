import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface ContactForm{
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  // Public endpoints
  submitContactForm(form: ContactForm): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Contact`, form);
  }
  
  submitCommissionRequest(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Commission`, formData).pipe(timeout(60000));
  }
}
