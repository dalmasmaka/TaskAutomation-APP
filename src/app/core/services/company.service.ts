import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Company } from "../models/company.model";
import { BehaviorSubject, catchError, filter, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { JwtService } from "./jwt.service";
import { CompanyConfig } from "../models/companyConfig.model";
import { Team } from "../../features/team/model/team.model";
import { GenerateInvitation, InvitationCodes } from "../models/invitation-codes.model";

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
    private companyConfigCache$?: Observable<CompanyConfig[] | null>;
    private companySubject = new BehaviorSubject<Company | null>(null);
    company$ = this.companySubject.asObservable();

    public companyConfigSubject = new BehaviorSubject<CompanyConfig[] | null>(null);
    companyConfig$ = this.companyConfigSubject.asObservable();

    public invitationCodeSubject = new BehaviorSubject<InvitationCodes[] | null>(null);
    invitationCode$ = this.invitationCodeSubject.asObservable();

    public teamSubject = new BehaviorSubject<Team[] | null>(null);
    team$ = this.teamSubject.asObservable();

    loadTeam(forceReload = false): Observable<Team[] | null> {
        if (!forceReload && this.teamSubject.value) {
            return this.team$;
        }

        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }

        return this.apiService.get<Team[]>(`${this.endpoint}/companyTeam`).pipe(
            tap(team => this.teamSubject.next(team)),
            catchError(err => {
                console.error(err);
                this.teamSubject.next(null);
                return of(null);
            })
        );
    }
    loadCodes(): Observable<InvitationCodes[] | null> {
        return this.apiService.get<InvitationCodes[]>(`${this.endpoint}/codes`).pipe(
            tap(code => this.invitationCodeSubject.next(code)),
            catchError(err => {
                console.error(err);
                this.companySubject.next(null);
                return of(null);
            }),
            shareReplay(1)
        );
    }
    generateCode(data: GenerateInvitation): Observable<InvitationCodes[] | null> {
        return this.apiService.post<InvitationCodes[], any>(`${this.endpoint}/generateCode`, data).pipe(
            tap(code => this.invitationCodeSubject.next(code)),
            catchError(err => {
                console.error(err);
                this.invitationCodeSubject.next(null);
                return of(null);
            }),
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

    updateCompany(company: Company): Observable<Company> {
        return this.apiService.put<Company, Company>(`${this.endpoint}/updateCompany`, company).pipe(
            tap(updatedFromServer => {
                // This is the "Gold Standard"
                this.companySubject.next(updatedFromServer);
            })
        );
    }

    // saveCompanyConfig(companyConfig: CompanyConfig): Observable<CompanyConfig | null> {
    //     return this.apiService.put<CompanyConfig, CompanyConfig>(`${this.endpoint}/saveCompanyConfig`, companyConfig).pipe(
    //         tap(updatedConfig => {
    //             // 3. BROADCAST: Send the new data to everyone listening
    //             const dataToShow = updatedConfig || companyConfig;
    //             this.companyConfigSubject.next(dataToShow);

    //             // 4. Reset cache so the next GET is fresh
    //             this.companyConfigCache$ = undefined;
    //         })
    //     );
    // }
    saveCompanyConfig(companyConfig: CompanyConfig): Observable<CompanyConfig | null> {
        return this.apiService
            .put<CompanyConfig, CompanyConfig>(`${this.endpoint}/saveCompanyConfig`, companyConfig)
            .pipe(
                tap((savedConfig) => {

                    if (!savedConfig) return;

                    const current = this.companyConfigSubject.value ?? [];

                    const existsIndex = current.findIndex(x => x.id === savedConfig.id);

                    let updatedList;

                    if (existsIndex > -1) {
                        updatedList = [...current];
                        updatedList[existsIndex] = savedConfig;
                    } else {
                        updatedList = [...current, savedConfig];
                    }

                    this.companyConfigSubject.next(updatedList);

                    this.companyConfigCache$ = undefined;
                })
            );
    }

    getCompanyConfig(id: string): Observable<CompanyConfig[] | null> {
        if (!this.companyConfigCache$) {
            this.companyConfigCache$ = this.apiService
                .get<CompanyConfig[]>(`${this.endpoint}/companyConfig/${id}`)
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
    deleteConfig(id: string) {
        return this.apiService.delete(`${this.endpoint}/deleteConfig/${id}`);
    }
    deleteCompany(id: string) {
        return this.apiService.delete(`${this.endpoint}/deleteCompany/${id}`);
    }
}