import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Company } from "../../features/company/models/company.model";
import { BehaviorSubject, catchError, filter, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { JwtService } from "./jwt.service";
import { CompanyConfig } from "../../features/company/models/companyConfig.model";
import { Team } from "../../features/team/model/team.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private endpoint = 'Company';
    private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    constructor(private apiService: ApiService, private jwtService: JwtService) {
        const hasToken = this.jwtService.isAuthenticated();
        this.isAuthenticatedSubject.next(hasToken);
    }
    private companyConfigCache$?: Observable<CompanyConfig | null>;
    private companySubject = new BehaviorSubject<Company | null>(null);
    company$ = this.companySubject.asObservable();

    public companyConfigSubject = new BehaviorSubject<CompanyConfig | null>(null);
    companyConfig$ = this.companyConfigSubject.asObservable();

    public teamSubject = new BehaviorSubject<Team | null>(null);
    team$ = this.teamSubject.asObservable();

    loadTeam(): Observable<Team | null> {
        if (this.teamSubject.value) {
            return this.team$;
        }

        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }

        return this.apiService.get<Team>(`${this.endpoint}/companyTeam`).pipe(
            tap(team => this.teamSubject.next(team)),
            catchError(err => {
                console.error(err);
                this.teamSubject.next(null);
                return of(null);
            }),
            shareReplay(1)
        );
    }
    loadCompanyIfNeeded(): Observable<Company | null> {
        // ✅ already loaded → return cached value
        if (this.companySubject.value) {
            return this.company$;
        }

        // ❌ not authenticated → return null
        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }

        // ✅ fetch and cache
        return this.apiService.get<Company>(`${this.endpoint}/company`).pipe(
            tap(company => this.companySubject.next(company)),
            catchError(err => {
                console.error(err);
                this.companySubject.next(null);
                return of(null);
            }),
            shareReplay(1)
        );
    }
    // loadCompany(): void {
    //     this.apiService.get<Company>(`${this.endpoint}/company`).pipe(
    //         tap(company => this.companySubject.next(company)),
    //         catchError(err => {
    //             console.error(err);
    //             return of(null);
    //         })
    //     ).subscribe();
    // }
    // loadCompanyIfNeeded(): Observable<Company | null> {
    //     if (!this.companySubject.value) {
    //         if (this.jwtService.isAuthenticated()) {
    //             this.loadCompany();
    //         }
    //     }
    //     return this.company$;
    // }

    updateCompany(company: Company): Observable<Company> {
        return this.apiService.put<Company, Company>(`${this.endpoint}/updateCompany`, company).pipe(
            tap(updatedFromServer => {
                // This is the "Gold Standard"
                this.companySubject.next(updatedFromServer);
            })
        );
    }

    saveCompanyConfig(companyConfig: CompanyConfig): Observable<CompanyConfig> {
        return this.apiService.put<CompanyConfig, CompanyConfig>(`${this.endpoint}/saveCompanyConfig`, companyConfig).pipe(
            tap(updatedConfig => {
                // 3. BROADCAST: Send the new data to everyone listening
                const dataToShow = updatedConfig || companyConfig;
                this.companyConfigSubject.next(dataToShow);

                // 4. Reset cache so the next GET is fresh
                this.companyConfigCache$ = undefined;
            })
        );
    }
    getCompanyConfig(id: string): Observable<CompanyConfig | null> {
        // If cache is undefined (which happens after a save), it will fetch fresh data
        if (!this.companyConfigCache$) {
            this.companyConfigCache$ = this.apiService
                .get<CompanyConfig>(`${this.endpoint}/companyConfig/${id}`)
                .pipe(
                    shareReplay(1),
                    catchError(err => {
                        console.error(err);
                        return of(null);
                    })
                );
        }
        return this.companyConfigCache$;
    }

}