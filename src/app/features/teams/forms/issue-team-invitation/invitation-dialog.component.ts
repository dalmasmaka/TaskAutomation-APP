import { Component, inject, OnInit, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";
import { MatIconModule } from "@angular/material/icon";
import { Team } from "../../../../core/models/teams-model";
import { CompanyService } from "../../../../core/services/company.service";
import { TeamService } from "../../../../core/services/teams.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Member } from "../../../../core/models/user.model";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-team-invitation",
    templateUrl: "./invitation-dialog.component.html",
    styleUrls: ["./invitation-dialog.component.css"],
    imports: [MatDialogModule, MultiSelectSearchComponent, MatIconModule, ReactiveFormsModule, MatButtonModule, MatInputModule, CommonModule]
})
export class InvitationDialogComponent implements OnInit {
    // 1. Properly inject dependencies
    private fb = inject(FormBuilder);
    private companyService = inject(CompanyService);
    private teamService = inject(TeamService);
    public dialogRef = inject(MatDialogRef<InvitationDialogComponent>);
    private data = inject(MAT_DIALOG_DATA);

    // 2. Initialize the form group with the injected FormBuilder
    invitationForm: FormGroup = this.fb.group({
        userIds: [[], Validators.required],
        teamIds: [[], Validators.required]
    });
    ngOnInit(): void {
        this.sendInvitations();
    }
    // 3. Keep signals readonly, update their values via .set()
    readonly teams = signal<Team[]>([]);
    readonly users = signal<Member[]>([]);

    sendInvitations(): void {
        // Subscribe to extract the data from the Observable stream
        // this.companyService.loadStaff().subscribe(usersData => {
        //     this.users.set(usersData ?? []); // Use empty array fallback if null
        // });
        this.companyService.loadStaff().subscribe(usersData => {
            const formattedUsers = (usersData ?? []).map(user => ({
                ...user,
                displayName: `${user.fullName} - (${user.email})`
            }));

            this.users.set(formattedUsers);
        });


        this.teamService.loadTeams().subscribe(teamsData => {
            this.teams.set(teamsData ?? []);
        });
    }

    confirmChanges(): void {
        // FIXED: Changed this.teamForm to this.invitationForm to match your declaration
        if (this.invitationForm.valid) {
            const updatedTeam = {
                ...this.data,
                ...this.invitationForm.value
            };
            this.dialogRef.close(updatedTeam);
        }
    }
}