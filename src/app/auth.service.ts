import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// 1. Define Types for the API responses
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthResponse extends User {
  accessToken: string;  // The JWT token
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://dummyjson.com/auth';

  // 1. Create a BehaviorSubject to hold the current state
  // Initial value checks if a token exists right now
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  // 2. Expose it as an Observable for the UI to subscribe to
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient,private router: Router) { }

  // Helper to check LocalStorage
  private hasToken(): boolean {
    // !! converts the result to a true/false boolean
    return !!localStorage.getItem('accessToken'); 
  }
  // ============================================================
  // 1. LOGIN
  // ============================================================
  login(username: string, password: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;
    
    return this.http.post<AuthResponse>(url, {
      username,
      password,
      expiresInMins: 30
    }, {
      headers: { 'Content-Type': 'application/json' },
      // withCredentials: true // Equivalent to credentials: 'include'
    }).pipe(
      // Optional: Save token to LocalStorage automatically upon success
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.loggedInSubject.next(true);
      })
    );
  }

  // ============================================================
  // 2. GET CURRENT USER (ME)
  // ============================================================
  getMe(): Observable<User> {
    const url = `${this.baseUrl}/me`;
    const token = localStorage.getItem('accessToken'); // Retrieve stored token

    // Add the Bearer Token to headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(url, {
      headers,
      // withCredentials: true
    });
  }

  // ============================================================
  // 3. REFRESH TOKEN
  // ============================================================
  refreshToken(): Observable<any> {
    const url = `${this.baseUrl}/refresh`;
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post(url, {
      refreshToken: refreshToken, // Pass the token in body
      expiresInMins: 30
    }, {
      headers: { 'Content-Type': 'application/json' },
      // withCredentials: true
    }).pipe(
      // Update the stored access token with the new one
      tap((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      })
    );
  }
  logout() {
    // 1. Remove tokens from LocalStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // 4. Notify app that user is logged out
    this.loggedInSubject.next(false);
    // 2. Navigate back to Login page
    this.router.navigate(['/login']);
  }
}