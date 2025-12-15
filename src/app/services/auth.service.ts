import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

// DTOs
export interface LoginCredentials{
  username: string;
  password: string;
}

export interface AuthResponse{
  token: string;
  username: string;
  email: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/Auth`;

  isAuthenticated = signal(false);
  currentUser = signal<string | null>(null);

  constructor() { 
    this.checkAuth();
  }

  private checkAuth(){
    const token = localStorage.getItem('admin_token');
    if(token){
      // TODO: eughgun ngjb nbnjgkb nfdklbnd. I need to verify the token isn't expired, fuck my life.
      this.isAuthenticated.set(true);
      this.currentUser.set(localStorage.getItem('admin_username'));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Store Token And User Info
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_username', response.username);
        this.isAuthenticated.set(true);
        this.currentUser.set(response.username);
      })
    );
  }

  logout(){
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken():string|null{
    return localStorage.getItem('admin_token');
  }
}
