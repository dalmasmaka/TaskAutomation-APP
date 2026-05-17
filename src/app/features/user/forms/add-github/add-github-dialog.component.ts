import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { UserService } from "../../../../core/services/user.service";
import { UserGitHub } from "../../../../core/models/auth-models";

@Component({
    selector: "app-create-project-dialog",
    templateUrl: "./add-github-dialog.component.html",
    styleUrls: ["./add-github-dialog.component.css"],
    imports: [ReactiveFormsModule, CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatDialogContent, MatDialogActions, MatButtonModule]
})
export class AddGitHubInfoDialogComponents implements OnInit {
    firstFormGroup!: FormGroup;
    userService = inject(UserService);
    github$!: Observable<UserGitHub | null>;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddGitHubInfoDialogComponents>

    ) { }
    ngOnInit(): void {
        this.firstFormGroup = this.fb.group({
            username: '',
            accessToken: ''
        });


    }
    confirmChanges(): void {
        if (this.firstFormGroup.valid) {
            this.dialogRef.close(this.firstFormGroup.value);
        }
    }

}