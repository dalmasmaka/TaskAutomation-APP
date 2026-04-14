import { Component, inject, OnInit, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from "@angular/material/dialog";
import { UserDetailsDialogComponent } from "./forms/update-user/user-details-dialog.component";
import { ActionModalComponent } from "../../core/layout/action-modals/action-modal.component";
import { AuthService } from "../../core/services/auth.service";
import { User } from "../../core/models/auth-models";
import { Observable } from "rxjs";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { firstValueFrom } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { ChangePasswordDialogComponent } from "./forms/change-pass/change-pass-dialog.component";

@Component({
    selector: "app-user-info",
    templateUrl: "./user-info.component.html",
    styleUrls: ["./user-info.component.css"],
    imports: [CommonModule, MatCardModule, MatButtonModule, MatFormField, MatLabel, MatInputModule]
})
export class UserInfoComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    private userService = inject(UserService)
    currentUser$!: Observable<User | null>;
    private snackBar = inject(MatSnackBar);

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    ngOnInit(): void {
        this.currentUser$ = this.userService.user$;

        this.userService.getCurrentUser().subscribe();
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
                        // this.currentUser$ = this.authService.getCurrentUser();
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
    async openChangePasswordDialog(): Promise<void> {
        const user = await firstValueFrom(this.currentUser$);
        this.dialog.open(ChangePasswordDialogComponent, {
            minWidth: '550px',
            data: user?.id
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
            console.log('The dialog was closed');
            if (result !== undefined) {
            }
        });
    }

}