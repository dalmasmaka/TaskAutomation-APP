import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CompanyConfig } from "../../models/companyConfig.model";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";


@Component({
  standalone: true,
  selector: "app-company-config",
  templateUrl: "./company-config-dialog.component.html",
  styleUrls: ["./company-config-dialog.component.css"],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent]
})
export class CompanyConfigDialogComponent implements OnInit {
  companyConfig: CompanyConfig;
  companyConfigForm!: FormGroup
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CompanyConfig,
    public dialogRef: MatDialogRef<CompanyConfigDialogComponent>
  ) {
    this.companyConfig = { ...data };
  }
  ngOnInit(): void {
    this.companyConfigForm = this.fb.group({
      provider: [this.data.provider, [Validators.required]],
      clientId: [this.data.clientId, [Validators.required]],
      clientSecret: [this.data.clientSecret, [Validators.required]],
      redirectUri: [this.data.redirectUri, [Validators.required]]
    })
  }

  confirmChanges(): void {
    if (this.companyConfigForm.valid) {
      const updatedCompanyConfig = {
        ...this.data,
        ...this.companyConfigForm.value
      };
      this.dialogRef.close(updatedCompanyConfig);
    }
  }
}