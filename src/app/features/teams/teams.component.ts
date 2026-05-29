import { Component, inject, OnInit, signal } from "@angular/core";
import { MembershipStatus, MemberTeams, Team, TeamMember } from "../../core/models/teams-model";
import { TeamService } from "../../core/services/teams.service";
import { MatDividerModule } from "@angular/material/divider";
import { MatTabsModule } from '@angular/material/tabs';
import { JwtService } from "../../core/services/jwt.service";
import { MatButtonModule } from "@angular/material/button";
import { MenuComponent } from "../../core/layout/menu/menu.component";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { TeamInfoDialogComponent } from "./forms/team-info/team-info-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActionModalComponent } from "../../core/layout/action-modals/action-modal.component";
import { TeamMembers } from "../../core/models/teams-model";
import { InvitationDialogComponent } from "./forms/issue-team-invitation/invitation-dialog.component";
import { MatCardModule } from "@angular/material/card";
import { Member } from "../../core/models/user.model";
import { Members } from "../../core/models/tasks-model";

@Component({
    selector: "app-teams",
    templateUrl: "./teams.component.html",
    styleUrls: ["./teams.component.css"],
    standalone: true,
    imports: [MatDividerModule, MatTabsModule, MatButtonModule, MenuComponent, MatListModule, MatIconModule, MatDividerModule, MatCardModule]
})
export class TeamsComponent implements OnInit {
    readonly teams = signal<Team[]>([]);
    public teamMembers = signal<TeamMembers | null>(null);
    public memberTeams = signal<MemberTeams | null>(null);
    private teamsService = inject(TeamService);
    public jwtService = inject(JwtService);
    readonly dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    public isOwner = this.jwtService.hasRole('Owner');
    public isDeveloper = this.jwtService.hasRole('Developer');
    public isManager = this.jwtService.hasRole('Manager');
     MembershipStatus = MembershipStatus;
    ngOnInit(): void {
        if (this.isOwner || this.isManager) {
            this.teamsService.loadTeams().subscribe((teams) => {
                this.teams.set(teams ?? []);
            });
            this.teamsService.getAllTeamMembers().subscribe(
                (members) => this.teamMembers.set(members ?? null)
            );
        }
        if (this.isDeveloper) {
            this.teamsService.getAllMemberTeams().subscribe(
                (teams) => this.memberTeams.set(teams ?? null)
            );
        }

    }
    
    loadTeams() {
        this.teamsService.loadTeams(true).subscribe((teams) => {
            this.teams.set(teams ?? []);
        });
    }
    loadTeamMembers() {
        this.teamsService.getAllTeamMembers(true).subscribe(
            (members) => this.teamMembers.set(members ?? null)
        );
    }
    loadTeamsOfMember() {
        this.teamsService.getAllMemberTeams(true).subscribe(
            (teams) => this.memberTeams.set(teams ?? null)
        );
    }
    addInvitations() {
        const dialogRef = this.dialog.open(InvitationDialogComponent, {
            minWidth: '650px',

        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamsService.sendInvitations(result).subscribe({
                    next: () => {
                        this.snackBar.open('Team added successfully!', 'Close', {
                            duration: 3000,
                        });
                        this.loadTeamMembers();
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to add team');
                    }
                })
            }
        })
    }
    getStatusClass(priority: string): string {
        switch (priority) {
            case 'Pending Approval':
                return 'pending';
            case 'Declined':
                return 'declined';
            case 'Active':
                return 'active';
            default:
                return '';
        }
    }
    removeMember(userId: string, teamId: number) {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamsService.removeTeamMember(userId, teamId).subscribe({
                    next: (res: any) => {
                        this.snackBar.open(res?.message || 'Team member deleted successfully', 'Close', {
                            duration: 3000,
                            panelClass: ['snackbar-success']
                        });
                        if (this.isDeveloper) {
                            this.loadTeamsOfMember();
                        }
                        this.loadTeamMembers();
                    },
                    error: (err) => {
                        const message = err?.error?.message || 'Failed to delete team member';

                        this.snackBar.open(message, 'Close', {
                            duration: 3000,
                            panelClass: ['snackbar-error']
                        });
                    }
                });
            }
        });
    }
    async addTeam() {
        const dialogRef = this.dialog.open(TeamInfoDialogComponent, {
            minWidth: '650px',
            // data: ""
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamsService.saveTeam(result).subscribe({
                    next: () => {
                        this.snackBar.open('Team added successfully!', 'Close', {
                            duration: 3000,
                        });
                        this.loadTeams();
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to add team');
                    }
                })
            }
        })
    }

    configMenuItems = [
        { label: 'Update Team', icon: 'settings', action: 'update' },
        { label: 'Delete Team', icon: 'delete', action: 'delete' },

    ];
    handleMenuAction(event: any) {
        const team = event.context;
        switch (event.action) {
            case 'update':
                this.updateTeam(team)
                break;
            case 'delete':
                this.deleteTeam(team.teamId)
                break;
            case 'remove':
                // this.removeMember(team., team.teamId)
                break;
        }
    }
    memberMenuItems = [
        { label: 'Revoke Access', icon: 'account_circle_off', action: 'remove' }
    ]
    onboardMenuItems = [
        { label: 'Revoke Invitation', icon: 'cancel_schedule_send', action: 'remove' }
    ]
    developerMenuItems = [
        { label: 'Leave Team', icon: 'account_circle_off', action: 'remove' }
    ]
    handleMembersMenu(event: any) {
        const member = event.context;
        switch (event.action) {
            case 'remove':
                this.removeMember(member.userId, member.teamId)
                break;

        }
    }
    deleteTeam(teamId: number) {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamsService.deleteTeam(teamId).subscribe({
                    next: (res: any) => {
                        this.snackBar.open(res?.message || 'Team deleted successfully', 'Close', {
                            duration: 3000,
                            panelClass: ['snackbar-success']
                        });

                        this.loadTeams();
                    },
                    error: (err) => {
                        const message = err?.error?.message || 'Failed to delete team';

                        this.snackBar.open(message, 'Close', {
                            duration: 3000,
                            panelClass: ['snackbar-error']
                        });
                    }
                });
            }
        });
    }
    updateTeam(team: Team) {
        const dialogRef = this.dialog.open(TeamInfoDialogComponent, {
            minWidth: '650px',
            data: team
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;

            this.teamsService.saveTeam(result).subscribe({
                next: (res: any) => {
                    this.snackBar.open(res?.message || 'Team updated successfully', 'Close', {
                        duration: 3000,
                        panelClass: ['snackbar-success']
                    });

                    this.loadTeams();
                },
                error: (err) => {
                    const message = err?.error?.message || 'Failed to update team';

                    this.snackBar.open(message, 'Close', {
                        duration: 3000,
                        panelClass: ['snackbar-error']
                    });
                }
            });
        });
    }
    getAvatarTheme(name: string) {
        const themes = [
            { bg: '#E8F5E9', text: '#2E7D32' }, // Green
            { bg: '#E3F2FD', text: '#1565C0' }, // Blue
            { bg: '#F3E5F5', text: '#7B1FA2' }, // Purple
            { bg: '#FFF3E0', text: '#E65100' }, // Orange
            { bg: '#FCE4EC', text: '#C2185B' }  // Pink
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return themes[Math.abs(hash) % themes.length];
    }
    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    updateStatus(member: TeamMember, status: any) {
        debugger
        this.teamsService.updateStatus(member.userId, member.teamId, status).subscribe({
            next: (res: any) => {
                this.snackBar.open(res?.message || 'Success', 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-success']
                });

                this.loadTeams();
            },
            error: (err) => {
                const message = err?.error?.message || 'Failed action';

                this.snackBar.open(message, 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-error']
                });
            }
        });
    }
}
