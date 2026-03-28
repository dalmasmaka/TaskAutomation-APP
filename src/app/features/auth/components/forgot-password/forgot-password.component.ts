import { Component, Output } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, Validators } from "@angular/forms";
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class ForgotPasswordComponent {
    ForgotPasswordForm: FormGroup;

    constructor() {
        this.ForgotPasswordForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }
}