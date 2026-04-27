import { inject, Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { JwtToken } from "../models/jwt-token";
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public decodedToken: JwtToken | null = null;
  private userRole: string | null = null;
  private isAuth = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (this.isBrowser()) {
      this.isAuth = this.checkAuth();
    }
  }

  private checkAuth(): boolean {
    const token = this.getToken();
    if (!this.isValidJwt(token)) return false;

    const helper = new JwtHelperService();
    return !helper.isTokenExpired(token);
  }

  isAuthenticated(): boolean {
    if (!this.isAuth && this.isBrowser()) {
      this.isAuth = this.checkAuth();
    }
    return this.isAuth;
  }


  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }
  private isValidJwt(token: string | null): boolean {
    return !!token && token.split('.').length === 3;
  }

  decodeToken(): JwtToken | null {
    const token = this.getToken();

    if (this.isValidJwt(token)) {
      const helper = new JwtHelperService();
      const decoded = helper.decodeToken(token!) as any;

      this.userRole =
        decoded?.role ||
        decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        null;

      this.decodedToken = {
        ...decoded,
        role: this.userRole
      };

      return this.decodedToken;
    }

    return null;
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      this.isAuth = true;
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
      this.isAuth = false;
      this.decodedToken = null;
      this.userRole = null;
    }
  }
  hasRole(role: string): boolean {
    const token = this.decodeToken();
    const userRole = token?.role;

    return userRole?.toLowerCase() === role.toLowerCase();
  }

}
// isBrowser() Method: This method checks whether the code is running in the browser.
// It's used in each method that accesses localStorage to ensure those methods only run in the browser.

// PLATFORM_ID and isPlatformBrowser: These are Angular tools that help you determine if the current platform is the browser.
//  When rendering on the server (e.g., using Angular Universal), the check will prevent the code that uses localStorage from executing,
// which solves the localStorage is not defined error.