import { Component, inject, OnInit } from "@angular/core";
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
import { CompanyService } from "../../core/services/company.service";
import { BehaviorSubject, filter, firstValueFrom, map, Observable, switchMap, take, tap } from "rxjs";
import { Company } from "./models/company.model";
import { CompanyConfig } from "./models/companyConfig.model";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from "../../core/services/auth.service";
import { JwtService } from "../../core/services/jwt.service";

@Component({
    selector: "app-company",
    templateUrl: "./company.component.html",
    styleUrls: ["./company.component.css"],
    imports: [CommonModule, MatCardModule, MatButtonModule, MatFormField, MatLabel, MatInputModule]
})
export class CompanyComponent implements OnInit {
    private snackBar = inject(MatSnackBar);

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    company$!: Observable<Company | null>;
    companyConfig$!: Observable<CompanyConfig | null>;
    private companyConfigSubject = new BehaviorSubject<CompanyConfig>({
        // id: '',
        provider: '',
        clientId: '',
        clientSecret: '',
        redirectUri: ''
    });
    readonly dialog = inject(MatDialog);
    constructor(private companyService: CompanyService, private jwtService: JwtService) {

    }

    ngOnInit() {
        // Just link your local variable to the service's continuous stream
        this.company$ = this.companyService.company$;
        this.companyConfig$ = this.companyService.companyConfig$;

        // Initial fetch (only happens once)
        this.companyService.loadCompanyIfNeeded().pipe(
            filter((c): c is Company => c !== null),
            take(1),
            switchMap(c => this.companyService.getCompanyConfig(c.id)),
            tap(config => this.companyService.companyConfigSubject.next(config))
        ).subscribe();
    }
    async openBasicInfoDialog(): Promise<void> {
        const company = await firstValueFrom(
            this.company$.pipe(
                filter((c): c is Company => c !== null),
                take(1)
            )
        );

        const dialogRef = this.dialog.open(CompanyInfoDialogComponent, {
            minWidth: '500px',
            data: company
        });
        dialogRef.afterClosed().pipe(
            filter(result => !!result),
            switchMap(result => this.companyService.updateCompany(result))
        ).subscribe({
            next: () => {
                this.snackBar.open('Company updated successfully!', 'Close', { duration: 3000 });
            },

            error: () => {
                this.snackBar.open('Failed to update company.', 'Close', { duration: 3000 });
            }
        });
    }
    async openCompanyConfigDialog(): Promise<void> {
        // Wait for a valid companyConfig before opening the dialog
        const companyConfig = await firstValueFrom(
            this.companyConfig$.pipe(
                filter((config): config is CompanyConfig => config !== null), // wait until non-null
                take(1) // only take the first emitted value
            )
        );


        const dialogRef = this.dialog.open(CompanyConfigDialogComponent, {
            minWidth: '600px',
            data: { ...companyConfig } // pass a copy
        });

        dialogRef.afterClosed().pipe(
            filter(result => !!result),
            switchMap(result => this.companyService.saveCompanyConfig(result))
        ).subscribe({
            next: () => {
                this.snackBar.open('Company config updated successfully!', 'Close', { duration: 3000 });

            },

            error: () => {
                this.snackBar.open('Failed to update company.', 'Close', { duration: 3000 });
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