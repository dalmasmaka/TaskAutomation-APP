import { Component, Inject, inject, OnInit, signal } from "@angular/core";
import { TeamService } from "../../../../core/services/teams.service";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtService } from "../../../../core/services/jwt.service";
import { ProjectTeam, Team } from "../../../../core/models/teams-model";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from "@angular/material/expansion";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ActionModalComponent } from "../../../../core/layout/action-modals/action-modal.component";

@Component({
    selector: "app-project-team",
    templateUrl: "./project-team-dialog.component.html",
    styleUrls: ["./project-team-dialog.component.css"],
    imports: [
        MatAccordion,
        MatButtonModule,
        MatExpansionPanel,
        MultiSelectSearchComponent,
        MatIconModule,
        MatExpansionModule,
        MatTableModule,
        MatDialogModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class ProjectTeamDialogComponent implements OnInit {
    private teamService = inject(TeamService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    public jwtService = inject(JwtService);
    public isOwner = this.jwtService.hasRole('Owner');
    public isDeveloper = this.jwtService.hasRole('Developer');
    public isManager = this.jwtService.hasRole('Manager');
    readonly teams = signal<ProjectTeam[]>([]);
    readonly availableTeams = signal<ProjectTeam[]>([]);
    readonly dialog = inject(MatDialog);
    teamForm: FormGroup = this.fb.group({
        teams: this.fb.control<number[]>([])
    });
    displayedColumns: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<ProjectTeamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { projectId: number }
    ) { }
    ngOnInit(): void {
        this.setColumns();
        this.fetchInitialData();
    }
    private setColumns(): void {
        const baseColumns = ['teamId', 'teamName', 'assignedAt'];

        if (this.isOwner) {
            this.displayedColumns = [...baseColumns, 'actions'];
        } else {
            this.displayedColumns = baseColumns;
        }
    }
    private fetchInitialData(): void {
        this.teamService.getProjectTeams(this.data.projectId).subscribe(m => this.teams.set(m ?? []));
        this.teamService.getAvailableTeamsForProject(this.data.projectId).subscribe(m => this.availableTeams.set(m ?? []));
    }
    addTeams() {
        const teamIds = this.teamForm.value.teams;

        this.teamService.assignProjectWithTeams(
            this.data.projectId,
            teamIds
        ).subscribe({
            next: (res) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-success']
                });
                 this.fetchInitialData();
            },
            error: (err) => {
                const message = err?.error?.message || 'Failed to assign teams';

                this.snackBar.open(message, 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-error']
                });
            }
        });
    }

    removeTeam(teamId: number) {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamService.unassignProjectFromTeam(this.data.projectId, teamId).subscribe({
                    next: (res) => {
                        this.teams.update(prev => prev.filter(m => m.teamId !== teamId));

                        this.snackBar.open(
                            res?.message || 'Project removed successfully',
                            'Close',
                            {
                                duration: 3000,
                                panelClass: ['snackbar-success']
                            }
                        );
                    },
                    error: (err) => {
                        const message =
                            err?.error?.message ||
                            err?.error?.Message ||
                            'Failed to remove project from team';

                        this.snackBar.open(message, 'Close', {
                            duration: 3000,
                            panelClass: ['snackbar-error']
                        });
                    }
                });
            }
        });


    }
}