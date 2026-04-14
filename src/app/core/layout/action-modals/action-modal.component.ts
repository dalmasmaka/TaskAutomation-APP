import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogRef, MatDialogActions, MatDialogContent } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-action-modal",
    templateUrl: "./action-modal.component.html",
    styleUrls: ["./action-modal.component.css"],
    imports: [CommonModule, MatDialogActions, MatDialogContent, MatButtonModule]
})
export class ActionModalComponent {
    confirmAction(): void {
        console.log("Action confirmed!");
        this.dialogRef.close(true); 
    }
    
    constructor(public dialogRef: MatDialogRef<ActionModalComponent>) {}
}