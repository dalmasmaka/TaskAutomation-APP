import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import { MatDivider } from "@angular/material/divider";
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm!: FormGroup;
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);
    successMessage: string | null = null;
    errorMessage: string | null = null;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {

    }
    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required]]
        })
    }
    onSubmit() {
        if (this.forgotPasswordForm.invalid) return;

        const email = this.forgotPasswordForm.value.email;
        this.successMessage = null;
        this.errorMessage = null;

        this.authService.forgotPassword(email).subscribe({
            next: (res: any) => {

               if (res.success) {
                this.successMessage = res.message;
                this.cdRef.markForCheck();
            } else {
                this.errorMessage = res.message;
                this.cdRef.markForCheck();
            }
            },
            error: (err) => {
                // real server/network error (500, no internet, etc.)
                this.snackBar.open(
                    err?.error?.message || 'Server error occurred',
                    'Close',
                    { duration: 3000 }
                );
            }
        });
    }
}