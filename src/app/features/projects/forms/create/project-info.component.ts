import { Component, Inject, OnInit } from "@angular/core";
import { Project } from "../../../../core/models/projects.model";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { inject, signal } from "@angular/core";
import { TeamService } from "../../../../core/services/teams.service";
import { Team } from "../../../../core/models/teams-model";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";
@Component({
    selector: "app-project-info",
    templateUrl: "./project-info.component.html",
    styleUrls: ["./project-info.component.css"],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatStepperModule,
        MultiSelectSearchComponent
    ]
})
export class ProjectInfoComponent implements OnInit {

    projectFormGroup!: FormGroup;
    providerFormGroup!: FormGroup;
    teamService = inject(TeamService);
    readonly availableTeams = signal<Team[]>([]);
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Project | null,
        public dialogRef: MatDialogRef<ProjectInfoComponent>
    ) { }
    private fetchInitialData(): void {

        this.teamService.loadTeams().subscribe(m => this.availableTeams.set(m ?? []));

    }
    ngOnInit(): void {
        this.fetchInitialData();
        this.isEditMode = !!this.data;

        this.projectFormGroup = this.fb.group({
            name: [this.data?.name ?? '', Validators.required],
           
        ...(this.isEditMode ? {} : {
            teams: [this.data?.teams ?? []]
        })
        });

        this.providerFormGroup = this.fb.group({
            provider: [this.data?.provider ?? '', Validators.required],
            repoName: [this.data?.repoName ?? '', Validators.required],
            repoOwner: [this.data?.repoOwner ?? '', Validators.required],
            defaultBranch: [this.data?.defaultBranch ?? '', Validators.required],
            accessToken: [this.data?.accessToken ?? '', Validators.required],
        });
    }

    confirmChanges(): void {
        const payload = {
            ...this.projectFormGroup.value,
            ...this.providerFormGroup.value
        };
        const result: Project = {
            ...(this.data ?? {} as Project),
            ...payload
        };

        this.dialogRef.close(result);
    }
}