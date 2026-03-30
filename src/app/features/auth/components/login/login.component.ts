import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef } from '@angular/core';
@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./login.component.css'],
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
    @Output() forgotPasswordClicked = new EventEmitter<void>();
    LoginForm: FormGroup;
    errorMessage: string | null = null;
    constructor(private authService: AuthService, private router: Router, private cdRef: ChangeDetectorRef) {
        this.LoginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }
    onLogin() {
        this.errorMessage = ''; // Clear it first

        const { email, password } = this.LoginForm.value;

        this.authService.login(email, password).subscribe({
            next: (res: any) => {
                console.log('Response received:', res); // DEBUG: Check your console
                if (res && res.success === false) {
                    this.errorMessage = res.message || 'Login failed';
                   this.cdRef.markForCheck();
                    console.warn('Login failed:', this.errorMessage); // DEBUG: Check your console
                } else {
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (err) => {
                console.error('Error received:', err); // DEBUG: Check your console
                // Check if message exists in the nested error object
                this.errorMessage = err.error?.message || err.message || 'Server Error';
               this.cdRef.markForCheck();
            }
        });
    }
}