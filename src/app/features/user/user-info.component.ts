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
    private destroyRef = inject(DestroyRef);
    private authService = inject(AuthService);
    private userService = inject(UserService)
    currentUser$!: Observable<User>;

    ngOnInit(): void {
        // assign the Observable from the servicea
        this.currentUser$ = this.authService.getCurrentUser();
    }
    async openUserDetailsDialog(): Promise<void> {
        const user = await firstValueFrom(this.currentUser$);
        const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
            minWidth: '700px',
            data: user
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // handle updated user here (call API, update local state, etc.)
                console.log('Updated user:', result);
                this.userService.updateUser(result).subscribe(() => {
                    this.currentUser$ = this.authService.getCurrentUser();
                })
            }
        });
    }
    async openChangePasswordDialog(): Promise<void> {
        this.dialog.open(ChangePasswordDialogComponent, {
            minWidth: '700px',
            // data: user.id
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