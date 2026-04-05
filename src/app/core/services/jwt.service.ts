import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { JwtToken } from "../models/jwt-token";
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public decodedToken: JwtToken | null = null;
  private userRole: string | null = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }
  // The double exclamation mark is a common JavaScript shorthand to convert a value into a boolean (true or false).
  private isValidJwt(token: string | null): boolean {
    return !!token && token.split('.').length === 3;
  }
  decodeToken(): JwtToken | null {
    if (this.decodedToken) {
      return this.decodedToken;
    }
    const token = this.getToken();

    if (this.isValidJwt(token)) {
      const helper = new JwtHelperService();
      const decoded = helper.decodeToken(token!) as JwtToken;

      this.decodedToken = decoded;
      this.userRole = decoded?.role ?? null;

      return decoded;
    }

    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!this.isValidJwt(token)) {
      return false;
    }

    const helper = new JwtHelperService();
    return !helper.isTokenExpired(token!);
  }
  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      this.decodeToken();
    }
  }

  saveRefreshToken(refreshToken: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  removeAuth(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      this.decodedToken = null;
      this.userRole = null;
    }
  }

  hasRole(role: string): boolean {
    if (!this.userRole) {
      this.decodeToken();
    }

    return this.userRole?.toLowerCase() === role.toLowerCase();
  }
}
// isBrowser() Method: This method checks whether the code is running in the browser.
// It's used in each method that accesses localStorage to ensure those methods only run in the browser.

// PLATFORM_ID and isPlatformBrowser: These are Angular tools that help you determine if the current platform is the browser.
//  When rendering on the server (e.g., using Angular Universal), the check will prevent the code that uses localStorage from executing,
// which solves the localStorage is not defined error.