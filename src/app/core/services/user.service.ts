import { BehaviorSubject, catchError, filter, Observable, of, switchMap, tap } from "rxjs";
import { Role, User, UserGitHub } from "../models/auth-models";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private endpoint = 'Auth';
    constructor(private api: ApiService, private authService: AuthService) { }
    public userSubject = new BehaviorSubject<User | null>(null);
    public user$: Observable<User | null> = this.userSubject.asObservable();
    public githubSubject = new BehaviorSubject<UserGitHub | null>(null);
    public github$: Observable<UserGitHub | null> = this.githubSubject.asObservable();
    public roleSubject = new BehaviorSubject<Role | null>(null);
    public role$: Observable<Role | null> = this.roleSubject.asObservable();
    updateUser(user: User): Observable<User> {
        return this.api.put<any, User>(`${this.endpoint}/updateUser`, user).pipe(
            tap((updatedFromServer) => {
                const dataToPublish = updatedFromServer || user;
                this.userSubject.next(dataToPublish);
            })
        );
    }

    getUserGitHubInfo(): Observable<UserGitHub | null> {
        if (this.githubSubject.value) {
            return this.github$;
        }

        return this.authService.isAuthenticatedSubject.pipe(
            filter(isAuth => isAuth === true),
            switchMap(() => this.api.get<UserGitHub>(`${this.endpoint}/githubInfo`)),
            tap((data) => this.githubSubject.next(data)),
            catchError((error) => {
                return of(null);
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
                return of(null);
            })
        );
    }
    saveUserGitHubInfo(github: UserGitHub) {
        return this.api.post<UserGitHub, any>(`${this.endpoint}/saveGitHubInfo`, github).pipe(
            tap(updatedFromServer => {
                this.githubSubject.next(updatedFromServer);
            })
        )
    }
    changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
        const body = {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        return this.api.put<any, any>(`${this.endpoint}/changePassword`, body);
    }
    changeUserRole(userId: string, newRole: string): Observable<any> {
        const body = {
            userId: userId,
            newRole: newRole
        }
        return this.api.put<any, any>(`${this.endpoint}/changeUserRole`, body);
    }
    loadRoles(userId: string): Observable<Role> {
        return this.api.get<Role>(`${this.endpoint}/getRoles/${userId}`);
    }
    deleteCompanyMember(userId: string) {
        return this.api.delete(`${this.endpoint}/deleteUser/${userId}`);
    }
}
