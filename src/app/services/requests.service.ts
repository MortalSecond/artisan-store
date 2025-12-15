import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactForm } from '../shared/models/contact-form';
import { environment } from '../../environments/environment.development';

export interface CommissionRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  size: string;
  stoneCoverage: string;
  frame: string;
  features?: string;
  treatments?: string;
  shipping: string;
  estimatedPrice: number;
  imageUrl?: string;
  submittedAt: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  // Admin endpoints
  getAllInquiries(): Observable<ContactForm[]> {
    return this.http.get<ContactForm[]>(`${this.apiUrl}/Contact`);
  }

  getInquiry(id: number): Observable<ContactForm> {
    return this.http.get<ContactForm>(`${this.apiUrl}/Contact/${id}`);
  }

  markInquiryAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Contact/${id}/mark-read`, {});
  }

  deleteInquiry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Contact/${id}`);
  }

  getAllCommissions(): Observable<CommissionRequest[]> {
    return this.http.get<CommissionRequest[]>(`${this.apiUrl}/Commission`);
  }

  getCommission(id: number): Observable<CommissionRequest> {
    return this.http.get<CommissionRequest>(`${this.apiUrl}/Commission/${id}`);
  }

  markCommissionAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Commission/${id}/mark-read`, {});
  }

  deleteCommission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Commission/${id}`);
  }
}
