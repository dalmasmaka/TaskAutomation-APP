import { Component, inject, OnInit } from "@angular/core";
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

@Component({
    selector: "app-projects",
    templateUrl: "./project-dialog.component.html",
    styleUrls: ["./project-dialog.component.css"],
    imports: [ReactiveFormsModule, CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatDialogContent, MatDialogActions, MatButtonModule]
})
export class ProjectDialogComponent implements OnInit {
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;
    companyService = inject(CompanyService);
    companyConfigs$!: Observable<CompanyConfig[] | null>;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProjectDialogComponent>

    ) { }
    ngOnInit(): void {
        this.firstFormGroup = this.fb.group({
            name: '',
            platform: '',
            repoURL: ''
        });


    }
    confirmChanges(): void {
        if (this.firstFormGroup.valid) {
            debugger
            console.log("dalma" + this.firstFormGroup.value)
            this.dialogRef.close(this.firstFormGroup.value);
        }
    }

}