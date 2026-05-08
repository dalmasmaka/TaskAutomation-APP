import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { JwtService } from "./jwt.service";
import { PagedPrResult, PRsQuery, PullRequest, Review } from "../models/pull-requests.model";
@Injectable({
    providedIn: 'root'
})
export class PullRequestsService {

    private endpoint = 'PullRequest';
    public pagedSubject = new BehaviorSubject<PagedPrResult | null>(null);
    public paged$: Observable<PagedPrResult | null> = this.pagedSubject.asObservable();
    constructor(private apiService: ApiService, private jwtService: JwtService) { }


    createPullRequest(pr: any): Observable<PullRequest> {
        return this.apiService.post(`${this.endpoint}/create-pull-request`, pr);
    }
    loadPRs(query: PRsQuery): Observable<PagedPrResult> {
        if (!this.jwtService.isAuthenticated()) {
            return of({
                items: [],
                totalCount: 0
            } as PagedPrResult);
        }
        const params: any = {
            pageNumber: query.pageNumber.toString(),
            pageSize: query.pageSize.toString()
        };
        if (query.status) params.status = query.status;
        if (query.search) params.search = query.search;
        if (query.projectIds?.length) {
            params.projectIds = query.projectIds;
        }
        if (query.taskIds?.length) {
            params.taskIds = query.taskIds;
        }
        if (query.createdByIds?.length) {
            params.createdByIds = query.createdByIds;
        }
        // Pass params as the options object, not part of the URL string
        return this.apiService.getWithParams<PagedPrResult>(`${this.endpoint}/pull-requests`, params).pipe(
            tap(projects => this.pagedSubject.next(projects)),
            catchError(err => {
                console.error('Error fetching tasks:', err);
                return of({
                    items: [],
                    totalCount: 0
                } as PagedPrResult);
            })
        );
    }
    addReview(review: Review) {
        return this.apiService.post<Review, any>(`${this.endpoint}/add-review`, review)
    }
    loadReviews(pullRequestId: number): Observable<Review[]> {
        return this.apiService.get<Review[]>(`${this.endpoint}/reviews/${pullRequestId}`);
    }
}