import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MatDialogModule, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { User } from "../../../../core/models/auth-models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
@Component({
    selector: "app-user-info",
    templateUrl: "./user-details-dialog.component.html",
    styleUrls: ["./user-details-dialog.component.css"],
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatDialogModule]
})
export class UserDetailsDialogComponent implements OnInit {
    user: User;
    userForm!: FormGroup
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: User,
        public dialogRef: MatDialogRef<UserDetailsDialogComponent>) {
        this.user = { ...data };
    }
    ngOnInit(): void {
        this.userForm = this.fb.group({
            name: [this.data.name, [Validators.required, Validators.minLength(2)]],
            lastname: [this.data.lastname, [Validators.required]],
            email: [this.data.email, [Validators.required, Validators.email]],
            phoneNumber: [this.data.phoneNumber, [Validators.required]]
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