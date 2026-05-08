import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";
import { BehaviorSubject, catchError, Observable, of, shareReplay, tap } from "rxjs";
import { Boards, Project, Projects } from "../models/projects.model";
import { User } from "../models/auth-models";
import { Team } from "../../features/team/model/team.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    private endpoint = 'Project';
    private integration = 'Integrations'
    constructor(private apiService: ApiService, private jwtService: JwtService) {
    }
    public projectsSubject = new BehaviorSubject<Projects[] | null>(null);
    projects$ = this.projectsSubject.asObservable();

    public memberSubject = new BehaviorSubject<Team[] | null>(null);
    member$ = this.memberSubject.asObservable();

    loadProjects(forceRefresh: boolean = false): Observable<Projects[] | null> {
        if (this.projectsSubject.value && !forceRefresh) {
            return this.projects$;
        }

        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }

        return this.apiService.get<Projects[]>(`${this.endpoint}/projects`).pipe(
            tap(projects => this.projectsSubject.next(projects)),
            catchError(err => {
                console.error(err);
                this.projectsSubject.next(null);
                return of(null);
            }),
            shareReplay(1)
        );
    }
    loadAvailableProjects(userId: string): Observable<Projects[] | null> {
        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }
        return this.apiService.get<Projects[]>(`${this.endpoint}/availableProjects/${userId}`);
    }
    loadAvailableUsers(projectId: number): Observable<User[] | null> {
        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }
        return this.apiService.get<User[]>(`${this.endpoint}/availableUsers/${projectId}`);
    }
    assignUserToProjects(userId: string, projectIds: string[]): Observable<any> {
        const body = {
            userId: userId,
            projects: projectIds
        };
        return this.apiService.post(`${this.endpoint}/assignUserToProjects`, body);
    }
    assignUsersToProject(projectId: number, userIds: string[]): Observable<any> {
        const body = {
            projectId: projectId,
            users: userIds
        };
        return this.apiService.post(`${this.endpoint}/assignUsersToProject`, body);
    }
    loadProjectMembers(projectId: number): Observable<Team[] | null> {
        return this.apiService.get<Team[]>(`${this.endpoint}/membersPerProject/${projectId}`)
    }
    removeMemberFromProject(projectId: number, userId: string,) {
        return this.apiService.delete(`${this.endpoint}/removeMember/${projectId}/${userId}`);
    }
    saveProject(project: Project) {
        return this.apiService.post<Project, any>(`${this.endpoint}/saveProject`, project);
    }
    connectIntegration(provider: string, projectId: number, companyId: number) {
        return this.apiService.get<any>(`${this.integration}/connect/${provider}/${projectId}/${companyId}`
        );
    }
    connectTrello(payload: { token: string, projectId: number, companyId: number }){
        return this.apiService.post(`${this.integration}/trello/token`, payload)
    };
    // Fetch boards available in Jira
    getBoards(provider: string, projectId: number, companyId: number): Observable<Boards[]> {
        return this.apiService.get<Boards[]>(`${this.integration}/boards/${provider}/${projectId}/${companyId}`);
    }

    // Save the selected board to the project
    linkBoard(payload: { provider: string, projectId: number, companyId: number, boardId: string, projectKey: string }): Observable<any> {
        return this.apiService.post(`${this.integration}/link-board`, payload);
    }
}