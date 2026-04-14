import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
    selector: "app-change-role",
    templateUrl: "./change-role-dialog.component.html",
    styleUrls: ["./change-role-dialog.component.css"],
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDialogModule]
})
export class ChangeRoleDialogComponent implements OnInit {
    roleForm!: FormGroup;
    roles: any[] = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ChangeRoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (this.data && this.data.roles) {
            this.roles = this.data.roles;
        }
    }

    ngOnInit(): void {
        this.roleForm = this.fb.group({
            roleId: [null]
        });
    }

    confirmChanges() {
        if (this.roleForm.valid) {
            this.dialogRef.close(this.roleForm.value);

        }
    }
}