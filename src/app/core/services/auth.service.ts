import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response';
import { JwtService } from './jwt.service';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/auth-models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private endpoint = 'Auth';
    private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private userSubject = new BehaviorSubject<User | null>(null);
    public user$: Observable<User | null> = this.userSubject.asObservable();

    constructor(private api: ApiService, private jwtService: JwtService) {
        this.isAuthenticatedSubject.next(this.jwtService.isAuthenticated());
    }

    login(email: string, password: string) {
        return this.api.post(`${this.endpoint}/login`, { email, password }).pipe(

            tap((res) => this.handleAuthSuccess(res as AuthResponse)),
            catchError((error) => throwError(() => error))
        );
    }

    register(finalData: any) {
        return this.api.post(`${this.endpoint}/register`, finalData).pipe(
            tap((res) => this.handleAuthSuccess(res as AuthResponse)),
            catchError((error) => throwError(() => error))
        );
    }

    private handleAuthSuccess(res: AuthResponse): void {
        if (res && res.message) {
            this.jwtService.saveToken(res.message);
            this.isAuthenticatedSubject.next(true);
        } else {
            this.isAuthenticatedSubject.next(false);
        }
    }

    getCurrentUser(): Observable<User> {
        return this.api.get<User>(`${this.endpoint}/me`).pipe(
            tap((data) => this.userSubject.next(data)),
            catchError((error) => {
                console.error('Error loading user', error);
                return of({} as User);
            })

        );
    }
}