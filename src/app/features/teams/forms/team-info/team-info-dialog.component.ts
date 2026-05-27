import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { Team } from "../../../../core/models/teams-model";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: "app-team-info",
    templateUrl: "./team-info-dialog.component.html",
    styleUrls: ["./team-info-dialog.component.css"],
    standalone: true,
    imports: [ ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ]
})
export class TeamInfoDialogComponent implements OnInit{
    team: Team;
    teamForm!: FormGroup;
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Team,
        public dialogRef: MatDialogRef<TeamInfoDialogComponent>
    ) {
        this.team = { ...data }
    }
    ngOnInit(): void {
        this.teamForm = this.fb.group({
            teamId: [this.data.teamId ?? 0],
            companyId: [this.data.companyId],
            teamName: [this.data.teamName, [Validators.required]]
        })
    }
    confirmChanges(): void {
        if (this.teamForm.valid) {
            const updatedTeam = {
                ...this.data,
                ...this.teamForm.value
            };
            this.dialogRef.close(updatedTeam);
        }
    }
}