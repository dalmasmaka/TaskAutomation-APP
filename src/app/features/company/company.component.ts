import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from "@angular/material/dialog";
import { CompanyConfigDialogComponent } from "./forms/company-config/company-config-dialog.component";
import { CompanyInfoDialogComponent } from "./forms/company-info/company-info-dialog.component";
import { ActionModalComponent } from "../../core/layout/action-modals/action-modal.component";



@Component({
    selector: "app-company",
    templateUrl: "./company.component.html",
    styleUrls: ["./company.component.css"],
    imports: [CommonModule, MatCardModule, MatButtonModule, MatFormField, MatLabel, MatInputModule]
})
export class CompanyComponent {
    // This component will handle company settings and information management
    readonly dialog = inject(MatDialog);

    openBasicInfoDialog(): void {
        const dialogRef = this.dialog.open(CompanyInfoDialogComponent, {
            minWidth: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result !== undefined) {
            }
        });
    }
    openCompanyConfigDialog(): void {
        const dialogRef = this.dialog.open(CompanyConfigDialogComponent, {
            minWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result !== undefined) {
            }
        });
    }
    leaveCompany(): void {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result !== undefined) {
            }
        });
    }
    deleteCompany(): void {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result !== undefined) {
            }
        });
    }

}   