import { CommonModule } from "@angular/common";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";
import { Projects } from "../../../../core/models/projects.model";

@Component({
    selector: "app-assign-user",
    templateUrl: "./assign-user-dialog.component.html",
    styleUrls: ['./assign-user-dialog.component.css'],
    imports: [MultiSelectSearchComponent, ReactiveFormsModule, CommonModule, MatDialogModule, MatButtonModule]
})
export class AssignUserDialogComponent implements OnInit {
    projectForm!: FormGroup

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<AssignUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    confirmChanges() {
        if (this.projectForm.valid) {
            this.dialogRef.close(this.projectForm.value);
            console.log(this.projectForm.value)
        }
    }
    ngOnInit(): void {
       
        this.projectForm = this.fb.group({
            projects: [[]]   // 👈 MUST be array for multi-select
        });
    }
}