import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";
import { DashboardInsights, PREngagement, TimeRange, WorkloadInsights } from "../models/insights.model";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private endpoint = 'DashboardInsights';
    private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    constructor(private apiService: ApiService, private jwtService: JwtService) {
        const hasToken = this.jwtService.isAuthenticated();
        this.isAuthenticatedSubject.next(hasToken);
    }
    getInsights(): Observable<DashboardInsights | null> {
        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }
        return this.apiService.get<DashboardInsights>(`${this.endpoint}/insights`);
    }
    getWorkloadInsights(range: TimeRange): Observable<WorkloadInsights> {
        if (!this.jwtService.isAuthenticated()) {
            return of({
                peakDistribution: [],
                availableBandwidth: []
            } as WorkloadInsights);
        }
        const params: any = {
            range: Number(range)
        }

        return this.apiService.getWithParams<WorkloadInsights>(
            `${this.endpoint}/workload`,
            params
        );
    }
    getPRsEngagement(range: TimeRange): Observable<PREngagement> {
        if (!this.jwtService.isAuthenticated()) {
            return of({
                totalPRs: 0,
                totalApproved: 0,
                totalCommented: 0,
                totalRequestChanges: 0,
                successRate: 0,
                topPerformers: []
            } as PREngagement);
        }
        const params: any = {
            range: Number(range)
        }

        return this.apiService.getWithParams<PREngagement>(
            `${this.endpoint}/prs`,
            params
        );
    }
}