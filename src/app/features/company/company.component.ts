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
import { Company } from "../../core/models/company.model";
import { CompanyConfig } from "../../core/models/companyConfig.model";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from "../../core/services/auth.service";
import { JwtService } from "../../core/services/jwt.service";
import { MatListModule } from "@angular/material/list";
import { MenuComponent } from "../../core/layout/menu/menu.component";
import { Router } from "@angular/router";

@Component({
    selector: "app-company",
    templateUrl: "./company.component.html",
    styleUrls: ["./company.component.css"],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatFormField,
        MatLabel,
        MatInputModule,
        MatListModule,
        MenuComponent
    ]
})
export class CompanyComponent implements OnInit {
    private snackBar = inject(MatSnackBar);

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    company$!: Observable<Company | null>;
    companyConfig$!: Observable<CompanyConfig[] | null>;

    readonly dialog = inject(MatDialog);
    constructor(private companyService: CompanyService, private jwtService: JwtService, private router: Router) {

    }

    ngOnInit() {
        this.company$ = this.companyService.company$;
        this.companyConfig$ = this.companyService.companyConfig$;
        this.companyService.loadCompanyIfNeeded().pipe(
            filter((c): c is Company => c !== null),
            take(1),
            switchMap(c => this.companyService.getCompanyConfig(c.id)),
            tap(config => this.companyService.companyConfigSubject.next(config))
        ).subscribe();
    }

    configMenuItems = [
        { label: 'Update Configuration', icon: 'settings', action: 'config' },
        { label: 'Delete Configuration', icon: 'delete', action: 'delete' },
    ];
    handleMenuAction(event: any) {
        const config = event.context;
        switch (event.action) {
            case 'config':
                this.updateConfig(config)
                break;
            case 'delete':
                this.deleteConfig(config.id)
                break;
        }
    }
    deleteConfig(id: any): void {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.companyService.deleteConfig(id).subscribe({
                    next: () => {
                        const current = this.companyService.companyConfigSubject.getValue();
                        const updated = current?.filter(c => c.id !== id) ?? [];

                        this.companyService.companyConfigSubject.next(updated);

                        this.snackBar.open('Configuration deleted successfully!', 'Close', {
                            duration: 3000
                        });
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to delete configuration');
                    }
                })
            }
        })
    }
    updateConfig(config: any) {
        const dialogRef = this.dialog.open(CompanyConfigDialogComponent, {
            minWidth: '650px',
            data: config
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.companyService.saveCompanyConfig(result).subscribe({
                    next: () => {

                        this.snackBar.open('Company configuration updated successfully!', 'Close', {
                            duration: 3000,

                        });
                    },
                    error: () => {
                        this.snackBar.open('Failed to update configuration', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        });
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
        const company = await firstValueFrom(
            this.company$.pipe(
                filter((c): c is Company => c !== null),
                take(1)
            )
        );
        const dialogRef = this.dialog.open(CompanyConfigDialogComponent, {
            minWidth: '650px',
            data: {
                config: [],
                companyId: company.id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.companyService.saveCompanyConfig(result).subscribe({
                    next: () => {
                        this.snackBar.open('Company Configuration added successfully!', 'Close', {
                            duration: 3000,

                        });
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to delete member');
                    }
                })
            }
        })
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
            if (result) {
                this.company$.subscribe(company => {
                    if (!company) return;

                    this.companyService.deleteCompany(company.id).subscribe({
                        next: () => {
                            
                            this.snackBar.open('Workspace and account deleted successfully!', 'Close', {
                                duration: 3000
                            });
                            this.logout()
                        },
                        error: () => {
                            this.snackBar.open('Failed to delete company');
                        }
                    });
                });
            }
        });
    }
    logout(): void {
        this.jwtService.removeAuth();
        this.router.navigate(['/login']);
    }
}   