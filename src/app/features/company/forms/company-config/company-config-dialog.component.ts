import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MatDialogActions, MatDialogContent } from "@angular/material/dialog";


@Component({
    selector: "app-company-config",
    templateUrl: "./company-config-dialog.component.html",
    styleUrls: ["./company-config-dialog.component.css"],
    imports: [CommonModule, MatInputModule, MatButtonModule, MatDialogActions, MatDialogContent]
})
export class CompanyConfigDialogComponent {
      constructor(public dialogRef: MatDialogRef<CompanyConfigDialogComponent>) {}

  confirmChanges(): void {
    console.log("Changes confirmed!");
    this.dialogRef.close(true); 
  }
}