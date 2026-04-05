import { Observable } from "rxjs";
import { User } from "../models/auth-models";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private endpoint = 'Auth';
    constructor(private apiService: ApiService) { }

    updateUser(user: User): Observable<any> {
        return this.apiService.put<any, User>(`${this.endpoint}/updateUser`, user);
    }

    changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
        debugger
        const body = {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        return this.apiService.put<any, any>(`${this.endpoint}/changePassword`, body);
    }
}