import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MatDialogModule, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserGitHub } from "../../../../core/models/auth-models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
@Component({
    selector: "app-user-info",
    templateUrl: "./update-github-dialog.component.html",
    styleUrls: ["./update-github-dialog.component.css"],
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatDialogActions,
        MatDialogContent,
        MatDialogModule]
})
export class UpdateGitHubDialogComponent implements OnInit {
    user: UserGitHub;
    userForm!: FormGroup
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: UserGitHub,
        public dialogRef: MatDialogRef<UpdateGitHubDialogComponent>) {
        this.user = { ...data };
    }
    ngOnInit(): void {
        this.userForm = this.fb.group({
            id: [this.data.id],
            username: [this.data.username, [Validators.required]],
            accessToken: [this.data.accessToken, [Validators.required]],
        });
    }
    confirmChanges(): void {
        if (this.userForm.valid) {
            const updatedUser = {
                ...this.data,
                ...this.userForm.value
            };
            this.dialogRef.close(updatedUser);
        }
    }
}