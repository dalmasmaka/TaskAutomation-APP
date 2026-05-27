import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { CompanyService } from "../../../../core/services/company.service";
import { filter, Observable, switchMap, take, tap } from "rxjs";
import { Company } from "../../../../core/models/company.model";
import { CompanyConfig } from "../../../../core/models/companyConfig.model";
import { TeamService } from "../../../../core/services/teams.service";
import { Team } from "../../../../core/models/teams-model";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";

@Component({
    selector: "app-create-project-dialog",
    templateUrl: "./create-project-dialog.component.html",
    styleUrls: ["./create-project-dialog.component.css"],
    imports: [ReactiveFormsModule, CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatDialogContent, MatDialogActions, MatButtonModule, MultiSelectSearchComponent]
})
export class CreateProjectDialogComponent implements OnInit {
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;
    companyService = inject(CompanyService);
    teamService = inject(TeamService)
    companyConfigs$!: Observable<CompanyConfig[] | null>;
    readonly availableTeams = signal<Team[]>([]);
    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateProjectDialogComponent>

    ) { }
    ngOnInit(): void {
        this.fetchInitialData();
        this.firstFormGroup = this.fb.group({
            name: '',
            provider: '',
            repoName: '',
            repoOwner: '',
            defaultBranch: '',
            accessToken: '',
            teams: []
        });


    }
    private fetchInitialData(): void {

        this.teamService.loadTeams().subscribe(m => this.availableTeams.set(m ?? []));

    }
    confirmChanges(): void {
        if (this.firstFormGroup.valid) {
            this.dialogRef.close(this.firstFormGroup.value);
        }
    }


}