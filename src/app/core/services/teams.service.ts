import { Injectable } from "@angular/core";
import { MembershipStatus, MemberTeams, ProjectTeam, Team, TeamMember, TeamMembers } from "../models/teams-model";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { JwtService } from "./jwt.service";
import { ApiService } from "./api.service";
import { Response } from "../models/auth-response";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private endpoint = 'Team';
    public teamSubject = new BehaviorSubject<Team[] | null>(null);
    team$ = this.teamSubject.asObservable();
    public teamMemberSubject = new BehaviorSubject<TeamMembers | null>(null);
    public teamMember$ = this.teamMemberSubject.asObservable();
    public memberTeamsSubject = new BehaviorSubject<MemberTeams | null>(null);
    public memberTeams$ = this.memberTeamsSubject.asObservable();

    constructor(private apiService: ApiService, private jwtService: JwtService) {
    }
    loadTeams(forceRefresh: boolean = false) {
        if (this.teamSubject.value && !forceRefresh) {
            return this.team$;
        }

        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }
        return this.apiService.get<Team[]>(`${this.endpoint}/teams`).pipe(
            tap(team => this.teamSubject.next(team)),
            catchError(err => {
                console.error(err);
                this.teamSubject.next(null);
                return of(null);
            })
        );
    }
    getProjectTeams(projectId: number): Observable<ProjectTeam[] | null> {
        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }
        return this.apiService.get<ProjectTeam[]>(`${this.endpoint}/project-teams/${projectId}`);
    }
    getAvailableTeamsForProject(projectId: number): Observable<ProjectTeam[] | null> {
        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }
        return this.apiService.get<ProjectTeam[]>(`${this.endpoint}/available-teams-per-project/${projectId}`);
    }
    unassignProjectFromTeam(projectId: number, teamId: number) {
        return this.apiService.delete<Response>(`${this.endpoint}/unassign-team-from-project/${projectId}/${teamId}`);
    }
    assignProjectWithTeams(projectId: number, teamIds: number[]) {
        return this.apiService.post<Response, any>(
            `${this.endpoint}/assign-project-with-teams`,
            {
                projectId,
                teamIds
            }
        );
    }
    saveTeam(team: Team) {
        return this.apiService.post<Response, any>(`${this.endpoint}/save-team`, team);
    }
    sendInvitations(body: any) {
        return this.apiService.post<Response, any>(`${this.endpoint}/send-invitations`, body);
    }
    deleteTeam(teamId: number) {
        return this.apiService.delete(`${this.endpoint}/delete-team/${teamId}`);
    }
    getAllTeamMembers(forceRefresh: boolean = false): Observable<TeamMembers | null> {
        if (this.teamMemberSubject.value && !forceRefresh) {
            return this.teamMember$;
        }

        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }

        return this.apiService.get<TeamMembers>(`${this.endpoint}/team-members`).pipe(
            tap(data => {
                this.teamMemberSubject.next(data);
            }),
            catchError(err => {
                console.error('Failed to fetch team members:', err);
                this.teamMemberSubject.next(null);
                return of(null);
            })
        );
    }
    getAllMemberTeams(forceRefresh: boolean = false): Observable<MemberTeams | null> {
        if (this.memberTeamsSubject.value && !forceRefresh) {
            return this.memberTeams$;
        }

        if (!this.jwtService.isAuthenticated()) {
            return of(null);
        }

        return this.apiService.get<MemberTeams>(`${this.endpoint}/user-teams`).pipe(
            tap(data => {
                this.memberTeamsSubject.next(data);
                console.log(data)
            }),
            catchError(err => {
                console.error('Failed to fetch teams of member', err);
                this.memberTeamsSubject.next(null);
                return of(null);
            })
        );
    }
    removeTeamMember(userId: string, teamId: number) {
        const body = {
            userId: userId,
            teamId: teamId
        };
        return this.apiService.put<Response, any>(`${this.endpoint}/remove-member`, body);
    }
   updateStatus(userId: string, teamId: number, status: MembershipStatus) {
    const body = {
        userId: userId,
        teamId: teamId,
        updateStatus: status
    };

    return this.apiService.put<any, any>(
        `${this.endpoint}/update-member`,
        body
    );
}
    
}
