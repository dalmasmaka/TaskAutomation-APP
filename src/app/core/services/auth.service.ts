import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Response } from '../models/auth-response';
import { JwtService } from './jwt.service';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/auth-models';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private endpoint = 'Auth';
    public isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


    constructor(private api: ApiService, private jwtService: JwtService) {
        const hasToken = this.jwtService.isAuthenticated();
        this.isAuthenticatedSubject.next(hasToken);
    }


    login(email: string, password: string) {
        return this.api.post(`${this.endpoint}/login`, { email, password }).pipe(

            tap((res) => this.handleAuthSuccess(res as Response)),
            catchError((error) => throwError(() => error))
        );
    }

    register(finalData: any) {
        return this.api.post(`${this.endpoint}/register`, finalData).pipe(
            tap((res) => this.handleAuthSuccess(res as Response)),
            catchError((error) => throwError(() => error))
        );
    }

    forgotPassword(email: any){
         return this.api.post(`${this.endpoint}/forgot-password`, { email}).pipe(
            catchError((error) => throwError(() => error))
        );
    }
    resetPassword(payload: { newPassword: string, email: string, token: string }) {
         return this.api.post(`${this.endpoint}/reset-password`, payload).pipe(
            // tap((res) => this.handleAuthSuccess(res as Response)),
            catchError((error) => throwError(() => error))
        );
    }
    private handleAuthSuccess(res: any): void {
        if (res && res.success && res.message) {
            this.jwtService.saveToken(res.message);
            this.isAuthenticatedSubject.next(true);
        } else {
            this.jwtService.removeAuth();
            this.isAuthenticatedSubject.next(false);
        }
    }

   
}