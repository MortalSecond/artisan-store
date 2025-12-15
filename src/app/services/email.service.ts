import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface ContactForm{
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  constructor() { }

  submitContactForm(form: ContactForm): Observable<any>{
    return this.http.post(`${this.apiUrl}/Contact`, form);
  }
  
  submitCommissionRequest(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}/Commission`, formData);
  }
}
