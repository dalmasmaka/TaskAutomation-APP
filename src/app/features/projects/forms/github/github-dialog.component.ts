import { Component, Inject, OnInit } from "@angular/core";
import { Project } from "../../../../core/models/projects.model";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
@Component({
    selector: "app-github-project-dialog",
    templateUrl: "./github-dialog.component.html",
    styleUrls: ["./github-dialog.component.css"],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogActions,
        MatDialogContent
    ]

})
export class GithubDialogComponent implements OnInit {
    project: Project;
    projectForm!: FormGroup
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Project,
        public dialogRef: MatDialogRef<GithubDialogComponent>) {
        this.project = { ...data };
    }
    ngOnInit(): void {
        this.projectForm = this.fb.group({
            name: [this.data.name, [Validators.required]],
            provider: [this.data.provider, [Validators.required]],
            repoName: [this.data.repoName, [Validators.required]],
            repoOwner: [this.data.repoOwner, [Validators.required]],
            defaultBranch: [this.data.defaultBranch, [Validators.required]],
            accessToken: [this.data.accessToken, [Validators.required]]
        });
    }
    confirmChanges(): void {
        if (this.projectForm.valid) {
            const updatedProject = {
                ...this.data,
                ...this.projectForm.value
            };
            this.dialogRef.close(updatedProject);
        }
    }
}