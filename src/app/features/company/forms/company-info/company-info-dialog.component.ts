import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MatDialogActions, MatDialogContent } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/select";
@Component({
    selector: "app-company-info",
    templateUrl: "./company-info-dialog.component.html",
    styleUrls: ["./company-info-dialog.component.css"],
    imports: [CommonModule, MatInputModule, MatButtonModule, MatDialogActions, MatDialogContent, MatSelect, MatOption]
})
export class CompanyInfoDialogComponent {
    constructor(public dialogRef: MatDialogRef<CompanyInfoDialogComponent>) { }
    confirmChanges(): void {
        console.log("Changes confirmed!");
        this.dialogRef.close(true);
    }
}