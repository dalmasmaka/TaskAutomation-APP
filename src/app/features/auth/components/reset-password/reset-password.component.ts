import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css', '../../../auth/components/auth.components.css'],
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm!: FormGroup;
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);
    successMessage: string | null = null;
    errorMessage: string | null = null;
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    token!: string;
    email!: string;
  
private router = inject(Router);
    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            this.email = params['email'];
        });
    }
    onSubmit() {
        debugger
        if (this.resetPasswordForm.invalid) return;

        const password = this.resetPasswordForm.value.password;

        const payload = {
            email: this.email,
            token: this.token,
            newPassword: password
        };

        this.authService.resetPassword(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.successMessage = res.message;
                    this.cdr.markForCheck();
                } else {
                    this.errorMessage = res.message;
                    this.cdr.markForCheck();
                }
            },
            error: (err) => {
                this.snackBar.open(
                    err?.error?.message || 'Server error occurred',
                    'Close',
                    { duration: 3000 }
                );
            }
        });

    }
    goToLogin() {
    this.router.navigate(['/login']); // or your auth route
}
}