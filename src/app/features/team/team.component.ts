
import { Component, inject, OnInit } from "@angular/core";
import { Team } from "./model/team.model";
import { Observable } from "rxjs";
import { CompanyService } from "../../core/services/company.service";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common'; // Import this
import { cx } from "../../ngm-dev-blocks/utils/functions";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from "@angular/material/dialog";
import { ChangeRoleDialogComponent } from "./forms/change-role/change-role-dialog.component";
import { UserService } from "../../core/services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActionModalComponent } from "../../core/layout/action-modals/action-modal.component";
import { ProjectsService } from "../../core/services/projects.service";
import { AssignUserDialogComponent } from "./forms/assign-user/assign-user-dialog.component";
import { MenuComponent } from "../../core/layout/menu/menu.component";
import { Projects } from "../../core/models/projects.model";
import { InvitationCodeDialogComponent } from "./forms/invitation-code/invitation-code-dialog.component";
import { JwtService } from "../../core/services/jwt.service";
@Component({
    selector: "app-team",
    templateUrl: "./team.component.html",
    styleUrls: ["./team.component.css"],
    standalone: true,
    imports: [MenuComponent, MatCardModule, MatIconModule, MatDividerModule, AsyncPipe, MatGridListModule, MatProgressSpinnerModule, MatMenuModule, MatButtonModule],
})
export class TeamComponent implements OnInit {
    team$!: Observable<Team[] | null>;
    private companyService = inject(CompanyService);
    private userService = inject(UserService);
    private projectsService = inject(ProjectsService);
    public jwtService = inject(JwtService);
      public isOwner = this.jwtService.hasRole('Owner');
    public isDeveloper = this.jwtService.hasRole('Developer');

    readonly cx = cx;
    readonly dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    projects: Projects[] = [];
    selectedProjects: number[] = [];
    ngOnInit(): void {
        this.team$ = this.companyService.team$;
        this.companyService.loadTeam().subscribe();
    }
    userMenuItems = [
        { label: 'Assign Member to Project', icon: 'edit', action: 'assign' },
        { label: 'Change Member Role', icon: 'admin_panel_settings', action: 'change' },
        { label: 'Delete Member Account', icon: 'delete', action: 'delete' }
    ];

    handleMenuAction(event: any) {
        const user = event.context;
        switch (event.action) {
            case 'assign':
                this.assignToProject(user.id);
                break;
            case 'change':
                this.changeRole(user.id);
                break;
            case 'delete':
                this.deleteUser(user.id);
                break;
        }
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
    async assignToProject(id: any) {

        this.projectsService.loadAvailableProjects(id).subscribe({
            next: (projects) => {
                const dialogRef = this.dialog.open(AssignUserDialogComponent, {
                    minWidth: '450px',
                    data: { projects: projects }

                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.projectsService.assignUserToProjects(id, result.projects).subscribe({

                            next: () => {
                                this.snackBar.open('Projects assigned successfully!', 'Close', {
                                    duration: 3000
                                });
                                this.companyService.loadTeam(true).subscribe();
                            },
                            error: (err) => {
                                this.snackBar.open('Error assigning projects.', 'Close', {
                                    duration: 3000
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    async changeRole(id: any) {
        this.userService.loadRoles(id).subscribe({
            next: (roles) => {
                const dialogRef = this.dialog.open(ChangeRoleDialogComponent, {
                    minWidth: '450px',
                    data: { roles: roles }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        console.log('Selected role:', result);
                        //  API to change the role
                        this.userService.changeUserRole(id, result.roleId).subscribe({
                            next: () => {
                                this.snackBar.open('User updated successfully!', 'Close', {
                                    duration: 3000
                                });
                                this.companyService.loadTeam(true).subscribe();
                            },
                            error: (err) => {
                                this.snackBar.open('Failed to update user.', 'Close', {
                                    duration: 3000
                                });
                            }
                        });
                    }
                });
            },
            error: (err) => console.error('Failed to load roles', err)
        });
    }
    deleteUser(id: any) {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.deleteCompanyMember(id).subscribe({
                    next: () => {
                        this.snackBar.open('Member account deleted successfully!', 'Close', {
                            duration: 3000
                        });
                        this.companyService.loadTeam(true).subscribe();
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to delete member');
                    }
                })
            }
        })
    }
    generateCodeDialog() {
        const dialogRef = this.dialog.open(InvitationCodeDialogComponent, {
            minWidth: '600px',
            minHeight: '600px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        })
    }
}

