import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

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

interface JwtPayload {
  exp: number;
  nameid: string;
  unique_name: string;
  email: string;
  role?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API Stuff
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/Auth`;

  // Token Variables
  private readonly tokenKey = 'admin_token';
  private readonly usernameKey = 'admin_username';

  // User States
  isAuthenticated = signal(false);
  currentUser = signal<string | null>(null);

  constructor() { 
    this.checkAuth();
  }

  // JWT Authorization Methods
  private checkAuth(){
    const token = this.getToken();

    if(!token){
      // No Token; No Entry
      // AKA: User not logged in
      return;
    }

    if(this.isTokenValid(token)){
      // Valid Token; Restore Session
      this.isAuthenticated.set(true);
      this.currentUser.set(localStorage.getItem(this.usernameKey));
    }
    else{
      this.clearAuthData();
    }
  }

  getToken():string|null{
    return localStorage.getItem(this.tokenKey);
  }

  isTokenValid(token: string): boolean{
    try{
      const decoded = jwtDecode<JwtPayload>(token);
      const expirationDate = decoded.exp * 1000;
      const currentTime = Date.now();

      return expirationDate > currentTime;
    }
    catch(error){
      console.log('Error decoding token:', error);
      return false;
    }
  }

  private clearAuthData(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
  
  getTimeUntilExpiration():number|null{
    const token = this.getToken();

    if(!token){
      return null;
    }

    try{
      const decode = jwtDecode<JwtPayload>(token);
      const expirationDate = decode.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = Math.floor((expirationDate - currentTime) / 1000);

      return timeRemaining > 0 ? timeRemaining:0;
    }
    catch{
      return null;
    }
  }

  isTokenExpiringSoon(): boolean{
    const timeRemaining = this.getTimeUntilExpiration();

    if(timeRemaining === null){
      return false;
    }
    
    return (timeRemaining < 300) && (timeRemaining > 0);
  }

  // Functional Methods
  login(credentials: LoginCredentials): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Store Token And User Info
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usernameKey, response.username);
        this.isAuthenticated.set(true);
        this.currentUser.set(response.username);
      })
    );
  }

  logout(){
    this.clearAuthData();
    this.router.navigate(['/admin/login']);
  }
}
