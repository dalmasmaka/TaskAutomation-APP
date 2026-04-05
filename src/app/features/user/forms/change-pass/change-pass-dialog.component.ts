import { CommonModule } from "@angular/common";
import { Component, inject, Inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { UserService } from "../../../../core/services/user.service";
import { NgZone } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-change-password",
    templateUrl: "./change-pass-dialog.component.html",
    styleUrls: ["./change-pass-dialog.component.css"],
    imports: [CommonModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatDialogModule]
})
export class ChangePasswordDialogComponent implements OnInit {
    userId: string;
    passwordForm!: FormGroup;
    notifyMessage = signal<string | null>(null);
    private userService = inject(UserService)
    constructor(
        private fb: FormBuilder,
        // 2. Inject the data once in the constructor
        @Inject(MAT_DIALOG_DATA) public data: string,

        // 3. Ensure the MatDialogRef matches this component class
        public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        private zone: NgZone,
    ) {
        // 4. Assign the data (which is user.id from your open call)
        this.userId = data;
    }
    ngOnInit(): void {
        this.passwordForm = new FormGroup({
            oldPassword: new FormControl('', Validators.required),
            newPassword: new FormControl('', Validators.required),
        });
    }
    confirmChanges(): void {
        if (this.passwordForm.invalid) return;

        const { oldPassword, newPassword } = this.passwordForm.value;
        
        this.userService.changePassword(this.userId, oldPassword, newPassword)
            .subscribe({
                next: (res: any) => {
                      this.zone.run(() => {
                            this.notifyMessage.set(res.message || '');
                        });
                },
                error: (err) => {
                    this.zone.run(() => {
                        this.notifyMessage.set(err.error?.message || err.message || 'Server Error');
                    });
                }
            });
    }
}