import { Component, inject, OnInit, DestroyRef } from "@angular/core";
import { AsyncPipe, CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from "@angular/material/dialog";
import { UserDetailsDialogComponent } from "./forms/update-user/user-details-dialog.component";
import { ActionModalComponent } from "../../core/layout/action-modals/action-modal.component";
import { AuthService } from "../../core/services/auth.service";
import { User, UserGitHub } from "../../core/models/auth-models";
import { Observable } from "rxjs";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { firstValueFrom } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { ChangePasswordDialogComponent } from "./forms/change-pass/change-pass-dialog.component";
import { JwtService } from "../../core/services/jwt.service";
import { Router } from "@angular/router";
import { MatDivider } from "@angular/material/divider";
import { UpdateGitHubDialogComponent } from "./forms/update-github/update-github-dialog.component";
import { AddGitHubInfoDialogComponents } from "./forms/add-github/add-github-dialog.component";

@Component({
    selector: "app-user-info",
    templateUrl: "./user-info.component.html",
    styleUrls: ["./user-info.component.css"],
    imports: [CommonModule, MatCardModule, MatButtonModule, MatFormField, MatLabel, MatInputModule, AsyncPipe, MatInputModule, MatButtonModule]
})
export class UserInfoComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    private userService = inject(UserService)
    private jwtService = inject(JwtService)
    currentUser$!: Observable<User | null>;
    userGitHub$!: Observable<UserGitHub | null>;
    private snackBar = inject(MatSnackBar);
    public isDeveloper = this.jwtService.hasRole('Developer');
    public isManager = this.jwtService.hasRole('Manager');
    constructor(private router: Router) {

    }
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    ngOnInit(): void {
        this.currentUser$ = this.userService.user$;
        this.userGitHub$ = this.userService.github$;
        this.userService.getCurrentUser().subscribe();
        this.userService.getUserGitHubInfo().subscribe();
    }
    async openUserDetailsDialog(): Promise<void> {
        const user = await firstValueFrom(this.currentUser$);

        const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
            minWidth: '550px',
            data: user
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.updateUser(result).subscribe({
                    next: () => {
                        this.snackBar.open('User updated successfully!', 'Close', {
                            duration: 3000
                        });
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to update user.', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        });
    }
    async openUserGitHubDetailsDialog(): Promise<void> {
        const github = await firstValueFrom(this.userGitHub$);

        const dialogRef = this.dialog.open(UpdateGitHubDialogComponent, {
            minWidth: '550px',
            data: github
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.saveUserGitHubInfo(result).subscribe({
                    next: () => {
                        this.snackBar.open('Configuration updated successfully!', 'Close', {
                            duration: 3000
                        });
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to update configuration.', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        });
    }
    saveNewGitHubConfig() {
        const dialogRef = this.dialog.open(AddGitHubInfoDialogComponents, {
            minWidth: '500px',

        })
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.saveUserGitHubInfo(result).subscribe({

                    next: () => {
                        this.snackBar.open('Project created successfully!', 'Close', {
                            duration: 3000
                        });
                        this.userService.getUserGitHubInfo().subscribe();
                    },
                    error: (err) => {
                        this.snackBar.open('Error creating project.', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        });
    }
    async openChangePasswordDialog(): Promise<void> {
        const user = await firstValueFrom(this.currentUser$);
        this.dialog.open(ChangePasswordDialogComponent, {
            minWidth: '550px',
            data: user?.id
        })
    }
    logout(): void {
        this.jwtService.removeAuth();
        this.router.navigate(['/login']);
    }
    leaveCompany(): void {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.currentUser$.subscribe(user => {
                    if (!user) return;

                    this.userService.deleteCompanyMember(user.id).subscribe({
                        next: () => {

                            this.snackBar.open('Member account deleted successfully!', 'Close', {
                                duration: 3000
                            });
                            this.logout()
                        },
                        error: () => {
                            this.snackBar.open('Failed to delete member');
                        }
                    });
                });
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