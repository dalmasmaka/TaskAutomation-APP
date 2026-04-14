import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/select";
import { Company } from "../../models/company.model";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
@Component({
    selector: "app-company-info",
    templateUrl: "./company-info-dialog.component.html",
    styleUrls: ["./company-info-dialog.component.css"],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatDialogActions,
        MatDialogContent,
        // MatSelect,
        // MatOption
    ]
})
export class CompanyInfoDialogComponent implements OnInit {
    company: Company;
    companyForm!: FormGroup;
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Company,
        public dialogRef: MatDialogRef<CompanyInfoDialogComponent>
    ) {
        this.company = { ...data }
    }
    ngOnInit(): void {
        this.companyForm = this.fb.group({
            name: [this.data.name, [Validators.required]]
        })
    }
    confirmChanges(): void {
        if (this.companyForm.valid) {
            const updatedCompany = {
                ...this.data,
                ...this.companyForm.value
            };
            this.dialogRef.close(updatedCompany);
        }
    }
}