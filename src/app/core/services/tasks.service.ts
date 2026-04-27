import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, catchError, Observable, of, shareReplay, tap } from "rxjs";
import { PagedResult, TaskMembersResponse, Tasks, TasksQuery } from "../models/tasks-model";
import { JwtService } from "./jwt.service";
import { CompanyAssets } from "../models/company-assets.model";
import { Team } from "../../features/team/model/team.model";
@Injectable({
    providedIn: 'root'
})
export class TasksService {

    private endpoint = 'Task';
    public taskSubject = new BehaviorSubject<Tasks | null>(null);
    public task$: Observable<Tasks | null> = this.taskSubject.asObservable();
    public pagedSubject = new BehaviorSubject<PagedResult | null>(null);
    public paged$: Observable<PagedResult | null> = this.pagedSubject.asObservable();
    constructor(private apiService: ApiService, private jwtService: JwtService) { }

    loadTasks(query: TasksQuery): Observable<PagedResult> {
        if (!this.jwtService.isAuthenticated()) {
            return of({
                items: [],
                totalCount: 0
            } as PagedResult);
        }
        // Construct the params object
        const params: any = {
            pageNumber: query.pageNumber.toString(),
            pageSize: query.pageSize.toString()
        };

        // if (query.projectId) params.projectId = query.projectId.toString();
        if (query.companyId) params.companyId = query.companyId.toString();
        if (query.status) params.status = query.status;
        if (query.priority) params.priority = query.priority;
        if (query.search) params.search = query.search;
        // if (query.assignedTo) params.assignedTo = query.assignedTo;
        if (query.projectIds?.length) {
            params.projectIds = query.projectIds;
        }

        if (query.assignedToIds?.length) {
            params.assignedToIds = query.assignedToIds;
        }
        // Pass params as the options object, not part of the URL string
        return this.apiService.getWithParams<PagedResult>(`${this.endpoint}/tasks`, params).pipe(
            tap(projects => this.pagedSubject.next(projects)),
            catchError(err => {
                console.error('Error fetching tasks:', err);
                return of({
                    items: [],
                    totalCount: 0
                } as PagedResult);
            })
        );
    }
    loadCompanyAssets(): Observable<CompanyAssets> {
        if (!this.jwtService.isAuthenticated()) {
            return of({
                projects: [],
                assigners: []
            });
        }

        return this.apiService.get<CompanyAssets>(`${this.endpoint}/companyAssets`);
    }
    deleteTask(taskId: number) {
        return this.apiService.delete(`${this.endpoint}/deleteTask/${taskId}`);
    }
    updateTask(task: Tasks): Observable<Tasks> {
        debugger
        return this.apiService.put<any, Tasks>(`${this.endpoint}/updateTask`, task).pipe(
            tap((updatedFromServer) => {
                debugger
                const dataToPublish = updatedFromServer || task;

                console.log('Pushing to UI:', dataToPublish);
                this.taskSubject.next(dataToPublish);
            })
        );
    }
    getAllMembers(taskId: number): Observable<TaskMembersResponse> {
        return this.apiService.get<TaskMembersResponse>(`${this.endpoint}/assignees/${taskId}`)
    }
    removeMemberFromTask(userId: string, taskId: number) {
        return this.apiService.delete(`${this.endpoint}/removeMember/${userId}/${taskId}`);
    }
}