import { BehaviorSubject, catchError, filter, Observable, of, switchMap, tap } from "rxjs";
import { User } from "../models/auth-models";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private endpoint = 'Auth';
    constructor(private api: ApiService, private authService: AuthService) { }
    private userSubject = new BehaviorSubject<User | null>(null);
    public user$: Observable<User | null> = this.userSubject.asObservable();

    updateUser(user: User): Observable<User> {
        return this.api.put<any, User>(`${this.endpoint}/updateUser`, user).pipe(
            tap((updatedFromServer) => {
                const dataToPublish = updatedFromServer || user;

                console.log('Pushing to UI:', dataToPublish);
                this.userSubject.next(dataToPublish);
            })
        );
    }

    getCurrentUser(): Observable<User | null> {
        if (this.userSubject.value) {
            return this.user$;
        }

        return this.authService.isAuthenticatedSubject.pipe(
            filter(isAuth => isAuth === true),
            switchMap(() => this.api.get<User>(`${this.endpoint}/me`)),
            tap((data) => this.userSubject.next(data)),
            catchError((error) => {
                console.error('Error loading user', error);
                // this.jwtService.removeAuth();
                return of(null);
            })
        );
    }
    changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
        const body = {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        return this.api.put<any, any>(`${this.endpoint}/changePassword`, body);
    }
}