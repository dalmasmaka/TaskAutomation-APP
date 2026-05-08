import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { SelectComponent } from "../../../../core/layout/select/select.component";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { Review } from "../../../../core/models/pull-requests.model";
import { external } from "jszip";
@Component({
    standalone: true,
    selector: "app-review-creation-dialog",
    templateUrl: "review-creation-dialog.component.html",
    styleUrl: "review-creation-dialog.component.css",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatDialogActions,
        MatDialogContent,
        SelectComponent,
    ]
})
export class ReviewCreationDialogComponent {
    firstFormGroup!: FormGroup;
    statuses = [
        { id: 'approve', name: 'Approved' },
        { id: 'reject', name: 'Changes Requested' },
        { id: 'comment', name: 'Commented' },
       
    ];
    constructor(private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Review,
        public dialogRef: MatDialogRef<ReviewCreationDialogComponent>

    ) { }

    ngOnInit(): void {
        this.firstFormGroup = this.fb.group({
            prId: [this.data.prId],
            projectId: [this.data.projectId],
            taskId: [this.data.taskId],
            comment: '',
            decision: '',
        });
    }
    confirmChanges(): void {
        if (this.firstFormGroup.valid) {
            this.dialogRef.close(this.firstFormGroup.value);
        }
    }

}