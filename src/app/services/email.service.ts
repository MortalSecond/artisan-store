import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = "http://localhost:5051/api/Contact";

  constructor() { }

  submitContactForm(form: ContactForm): Observable<any>{
    return this.http.post(this.apiUrl, form);
  }
}
