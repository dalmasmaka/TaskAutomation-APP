import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader } from "@angular/material/expansion";
import { GenerateInvitation, InvitationCodes } from "../../../../core/models/invitation-codes.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from "../../../../core/services/company.service";
import { map, Observable } from "rxjs";
import { SelectComponent } from "../../../../core/layout/select/select.component";
@Component({
    selector: "app-invitation-code",
    templateUrl: "./invitation-code-dialog.component.html",
    styleUrls: ["./invitation-code-dialog.component.css"],
    imports: [ReactiveFormsModule, CommonModule, MatDialogModule, MatButtonModule,
        MatIconModule, MatTableModule, MatChipsModule, MatNativeDateModule, MatDatepickerModule,
        MatInputModule, MatFormFieldModule, MatTimepickerModule, MatAccordion,
        MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader, SelectComponent],
    providers: [provideNativeDateAdapter()],
})
export class InvitationCodeDialogComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    invitationForm!: FormGroup;
    codes$!: Observable<InvitationCodes[] | null>;
    private companyService = inject(CompanyService)
    constructor(private fb: FormBuilder, private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<InvitationCodeDialogComponent>) { }
    dataSource: any[] = [];
    roles = [
        { id: 0, role: 'Developer' },
        { id: 1, role: 'Manager' },
        { id: 2, role: 'Owner' }
    ];
    ngOnInit(): void {
        this.invitationForm = this.fb.group({
            role: [0, Validators.required],
            expiryDate: ['', Validators.required],
        });

        this.companyService.invitationCode$.subscribe(data => {
            if (data) {
                console.log(data)
                this.dataSource = data.map(x => ({
                    code: x.invitationCode,
                    status: x.expirationStatus,
                    stringRole: x.stringRole
                }));
                this.cdr.markForCheck();
                
            }
        });

        // Initial load
        this.companyService.loadCodes().subscribe();
    }
    confirmChanges() {

    }
    displayedColumns: string[] = ['code', 'status', 'role', 'actions'];


    copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            this.snackBar.open('Code copied to clipboard!', 'Close', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
            });
        });
    }
    generateNewCode() {
        if (this.invitationForm.valid) {
            const rawValue = this.invitationForm.value;

            // Map form values to your Model
            // const payload: GenerateInvitation = {
            //     expiryDate: rawValue.expiryDate,
            //     role: rawValue.role
            // };

            this.companyService.generateCode(rawValue).subscribe({
                next: () => {
                    this.snackBar.open('Code generated!', 'Close', { duration: 3000 });
                    this.companyService.loadCodes().subscribe();
                },
                error: (err) => console.error("Subscription error", err)
            });
        }
    }
}