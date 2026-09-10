import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  AuthUser,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly storageKey = 'eduBridge.jwt';
  private initializationRequest: Observable<boolean> | null = null;

  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<AuthUser | null>(null);
  readonly authReady = signal(false);
  readonly isAuthenticated = computed(
    () => this.authReady() && Boolean(this.token()) && this.currentUser() !== null
  );

  constructor() {
    this.restoreSession();
  }

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${API_CONFIG.baseUrl}/Auth/login`, credentials)
      .pipe(
        tap((response) => this.saveToken(response.token)),
        switchMap(() => this.getCurrentUser()),
        tap(() => this.authReady.set(true)),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }

  waitForInitialization(): Observable<boolean> {
    if (this.authReady()) {
      return of(this.isAuthenticated());
    }

    if (this.initializationRequest) {
      return this.initializationRequest;
    }

    const storedToken = this.getStoredToken();

    if (!storedToken) {
      this.authReady.set(true);
      return of(false);
    }

    this.token.set(storedToken);
    this.initializationRequest = this.getCurrentUser().pipe(
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
      tap(() => this.authReady.set(true)),
      finalize(() => {
        this.initializationRequest = null;
      })
    );

    return this.initializationRequest;
  }

  getCurrentUser() {
    return this.http
      .get<CurrentUserResponse>(`${API_CONFIG.baseUrl}/Auth/me`)
      .pipe(
        map((response) => {
          const user = this.mapCurrentUser(response);
          this.currentUser.set(user);
          return user;
        }),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    return this.token();
  }

  clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.authReady.set(false);
    localStorage.removeItem(this.storageKey);
  }

  private restoreSession(): void {
    const storedToken = this.getStoredToken();

    if (!storedToken) {
      this.authReady.set(true);
      return;
    }

    this.token.set(storedToken);
    this.waitForInitialization().subscribe();
  }

  private saveToken(token: string): void {
    this.token.set(token);
    localStorage.setItem(this.storageKey, token);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  private mapCurrentUser(response: CurrentUserResponse): AuthUser {
    return {
      id: response.id,
      email: response.email,
      roles: response.roles ?? []
    };
  }
}
